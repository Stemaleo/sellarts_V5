import graphene
import logging
from typing import Dict, List, Any, Optional
from anka import models as anka_models
from order import models as order_models
import requests
from . import types as types
import math
from decimal import Decimal
logger = logging.getLogger(__name__)

def find_closest_higher_value(from_country: dict, to_country: str, weight: float) -> float:
    """Returns the rate for a given country and weight."""
    
    if to_country not in from_country:
        raise KeyError(f"Destination country '{to_country}' not found in shipping rates")
    
    weight_list = sorted([float(x) for x in from_country.get(to_country).keys()])  # Sort the list of weights
    
    if weight in weight_list:
        return from_country[to_country][str(float(weight))]
    
    higher_values = [x for x in weight_list if x > weight]
    
    if not higher_values:
        raise ValueError(f"No shipping rate found for weight {weight} to {to_country}")
    
    return from_country[to_country][str(float(min(higher_values)))]


class FeatureGenerateShippingFees(graphene.Mutation):
    success: bool = graphene.Boolean()
    message: str = graphene.String()
    order: Optional[anka_models.Orders] = graphene.Field(types.OrdersType)

    class Arguments:
        order = graphene.ID(required=True)
        country = graphene.ID(required=True)

    @classmethod
    def mutate(cls, root, info, **kwargs) -> "FeatureGenerateShippingFees":
        try:
            logger.info(f"Generating shipping fees for order {kwargs['order']}")
            
            order = anka_models.Orders.objects.get(id=kwargs["order"])
            country = order_models.Country.objects.get(id=kwargs["country"])

            # Group order items by artwork owner
            owner_items: Dict[int, Dict[str, Any]] = {}
            order_items = anka_models.OrderItem.objects.filter(order=order.id).select_related('art_work', 'art_work__owner')

            for order_item in order_items:
                artwork = order_item.art_work
                artwork_owner = artwork.owner

                if artwork_owner.id not in owner_items:
                    owner_items[artwork_owner.id] = {
                        'owner': artwork_owner,
                        'total_size': 0,
                        'artworks': []
                    }

                owner_items[artwork_owner.id]['artworks'].append(artwork)
                owner_items[artwork_owner.id]['total_size'] += (artwork.size + 3) * order_item.quantity

            # Calculate shipping fees for each owner's items
            total_shipping_fees: float = 0
            
            for owner_id, owner_data in owner_items.items():
                owner = owner_data['owner']
                total_size = owner_data['total_size']
                
                # Get origin country code from the owner
                origin_country_code: str = owner.country.code
                
                # Get destination country code from the country parameter
                destination_country_code: str = country.code
                
                # Calculate shipping fee based on origin country
                if origin_country_code in ["BJ", "NG", "SN", "ZA", "CI"]:
                    country_choice = order_models.Country.objects.get(code=origin_country_code).shipping_rates
                    shipping_fee: float = float(find_closest_higher_value(country_choice, destination_country_code, total_size))
                else:
                    shipping_fee: float = 100000

                # Add shipping fee plus 10% to total
                total_shipping_fees += shipping_fee + (shipping_fee * 0.10)

            order.size = float(sum(data['total_size'] for data in owner_items.values()))
            order.country = country
            order.country_code = country.code
            order.shipping_fees = math.ceil(total_shipping_fees)
            # order.total_amount = Decimal(math.ceil(math.ceil(order.total_amount) + float(total_shipping_fees)))
            order.save()

            logger.info(f"Successfully updated order {order.id} with shipping fees")

            return FeatureGenerateShippingFees(
                success=True, message="Success", order=order
            )

        except Exception as e:
            logger.error(f"Error generating shipping fees: {str(e)}", exc_info=True)
            return FeatureGenerateShippingFees(
                success=False,
                message=str(e),
            )

class FeatureVerifyShippingLabel(graphene.Mutation):
    success = graphene.Boolean()
    message = graphene.String()
    shipping_data = graphene.JSONString()
    order = graphene.Field(types.OrdersType)

    class Arguments:
        order = graphene.ID(required=True)

    @classmethod
    def mutate(cls, root, info, order) -> "FeatureVerifyShippingLabel":
        try:
            logger.info(f"Verifying shipping label for order {order}")
            
            order = anka_models.Orders.objects.get(id=order)

            if not order.internal_reference:
                logger.warning(f"Order {order.id} has no internal reference")
                return FeatureVerifyShippingLabel(
                    success=False, message="Order has no internal reference"
                )

            headers: Dict[str, str] = {
                "Authorization": "Token FqvbsxHBxTKmbZyNcPvvNbFm",
                "Accept": "application/vnd.api+json",
                "Content-Type": "application/json",
            }

            # Get all shipping records for this order
            shipping_records = order_models.Shipping.objects.filter(order=order)
            
            shipping_data_list: List[Dict[str, Any]] = []
            
            for shipping in shipping_records:
                if not shipping.label_pdf or not shipping.invoice_pdf or not shipping.label:
                    logger.info(f"Fetching new shipping info for shipping record {shipping.id}")
                    
                    # Get the internal reference specific to this shipping/owner
                    shipping_reference: str = f"{order.internal_reference}_{shipping.user.id}"
                    
                    response = requests.get(
                        f"https://api.anka.fyi/v1/shipment/labels/{shipping_reference}",
                        headers=headers,
                    )

                    if response.status_code != 200:
                        logger.error(f"API request failed with status code {response.status_code}")
                        continue

                    shipping_data: Dict[str, Any] = response.json()

                    if "data" in shipping_data and "attributes" in shipping_data["data"]:
                        attributes = shipping_data["data"]["attributes"]
                        if "package" in attributes and "pdf" in attributes["package"]:
                            shipping.label_pdf = attributes["package"]["pdf"].get("label")
                            shipping.invoice_pdf = attributes["package"]["pdf"].get("invoice")
                            shipping.label = attributes.get("provider_reference")
                            shipping.save()
                            logger.info(f"Updated shipping record {shipping.id} with new information")
                
                # Add shipping data to list
                shipping_data_list.append({
                    "data": {
                        "type": "shipment_labels",
                        "attributes": {
                            "status": "queued",
                            "internal_reference": f"{order.internal_reference}_{shipping.user.id}",
                            "provider_reference": shipping.label,
                            "owner": {
                                "id": shipping.user.id,
                                "name": shipping.user.name,
                                "email": shipping.user.email
                            },
                            "package": {
                                "pdf": {
                                    "label": shipping.label_pdf,
                                    "invoice": shipping.invoice_pdf,
                                }
                            },
                        },
                    }
                })

            if not shipping_data_list:
                return FeatureVerifyShippingLabel(
                    success=False,
                    message="No shipping records found for this order",
                )

            return FeatureVerifyShippingLabel(
                success=True,
                message="Successfully retrieved shipping information",
                shipping_data=shipping_data_list,
                order=order,
            )

        except anka_models.Orders.DoesNotExist:
            logger.error(f"Order {order} not found")
            return FeatureVerifyShippingLabel(success=False, message="Order not found")
        except Exception as e:
            logger.error(f"Error verifying shipping label: {str(e)}", exc_info=True)
            return FeatureVerifyShippingLabel(success=False, message=str(e))
