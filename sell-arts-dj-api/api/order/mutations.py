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



class InputAddressType(graphene.InputObjectType):
    country = graphene.String()
    state = graphene.String()
    city = graphene.String()
    zip = graphene.String()
    street_line_1 = graphene.String()
    street_line_2 = graphene.String()

class InputContactType(graphene.InputObjectType):
    email = graphene.String()
    fullname = graphene.String()
    phone_number = graphene.String()

class FeatureGenerateShippingFees(graphene.Mutation):
    success: bool = graphene.Boolean()
    message: str = graphene.String()
    order: Optional[anka_models.Orders] = graphene.Field(types.OrdersType)
    shipping_estimate= graphene.JSONString()

    class Arguments:
        order = graphene.ID(required=True)
        address = InputAddressType(required=True)
        contact = InputContactType(required=True)

    @classmethod
    def mutate(cls, root, info, **kwargs) -> "FeatureGenerateShippingFees":
        try:
            logger.info(f"Generating shipping fees for order {kwargs['order']}")
            
            order = anka_models.Orders.objects.get(id=kwargs["order"])
            address = kwargs["address"]
            contact = kwargs["contact"]

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
                        'artworks': [],
                        'items': []
                    }

                owner_items[artwork_owner.id]['artworks'].append(artwork)
                owner_items[artwork_owner.id]['total_size'] += (artwork.size + 3) * order_item.quantity
                
                # Add item details for shipping estimate
                owner_items[artwork_owner.id]['items'].append({
                    "quantity": order_item.quantity,
                    "price_currency": "XOF",
                    "hscode": "9701.10.0000",  # Default HS code for paintings
                    "description": artwork.title,
                    "weight_grams": int(artwork.size * 100),  # Convert size to grams
                    "price_cents": int(float(artwork.price) * 100)  # Convert to cents
                })

            # Calculate shipping fees using Anka API
            total_shipping_fees: float = 0
            shipping_estimate_response = None
            
            for owner_id, owner_data in owner_items.items():
                owner: anka_models.Users = owner_data['owner']
                total_size = owner_data['total_size']
                items = owner_data['items']
                print(total_size, "total_size")
                # Calculate package dimensions based on total size
                # Use artwork size to estimate dimensions, with some padding for packaging
                base_dimension = math.sqrt(total_size) # Get base dimension from total area
                
                # Scale dimensions proportionally based on total size
                # Add padding for packaging materials
                height_cm = max(20, round(base_dimension * 0.5)) # Minimum 20cm height
                length_cm = max(20, round(base_dimension * 1.2)) # Length typically larger
                width_cm = max(25, round(base_dimension * 0.8)) # Width between height and length
                
                # Update dimensions that will be used in estimate_payload
                print(height_cm, length_cm, width_cm,  int(total_size * 100), "dimensions")
                estimate_dimensions = {
                    "height_cm": height_cm,
                    "length_cm": length_cm, 
                    "width_cm": width_cm,
                    "weight_grams": 1000 # Keep existing weight calculation
                    # "weight_grams": int(total_size * 1000)  # Keep existing weight calculation
                }
                
                # Prepare data for Anka API
                internal_reference = f"SELLARTS{order.id}_{owner.id}"
                
                # Create estimate request payload
                estimate_payload = {
                    "data": {
                        "type": "shipment_estimates",
                        "attributes": {
                            "package": {
                                "items": items,
                                "dimensions": estimate_dimensions,
                                "description": f"Artwork from {owner.name}"
                            },
                            "internal_reference": internal_reference,
                            "duty_code": "ddps",
                            "currency": "XOF",
                            "shipper": {
                                "contact": {
                                    "email": owner.email,
                                    "fullname": owner.name,
                                    "phone_number": owner.phone_number
                                },
                                "address": {
                                    "country": owner.country_code,
                                    "state":  owner.state[0:29] or "",
                                    "street_line_1": owner.street_line_1[0:29] or "",
                                    "city": owner.city[0:29] or "",
                                    "zip": owner.zip[0:29] or "",
                                    "street_line_2": ""
                                }
                            },
                            "recipient": {
                                "contact": {
                                    "email": contact.email,
                                    "fullname": contact.fullname,
                                    "phone_number": contact.phone_number
                                },
                                "address": {
                                    "country": address.country,
                                    "state": address.state[0:29] or "",
                                    "street_line_1": address.street_line_1[0:29] or "",
                                    "city": address.city[0:29] or "",
                                    "zip": address.zip[0:29] or "",
                                    "street_line_2": ""
                                }
                            }
                        }
                    }
                }
                
                # Make API request to Anka
                headers = {
                    "Authorization": "Token FqvbsxHBxTKmbZyNcPvvNbFm",
                    "Content-Type": "application/json"
                }
                
                try:
                    response = requests.post(
                        "https://api.anka.fyi/v1/shipment/estimates",
                        headers=headers,
                        json=estimate_payload
                    )
                    print(response.json(), "response")
                    
                    if response.status_code in [200, 201]:
                        estimate_data = response.json()
                        shipping_estimate_response = estimate_data
                        
                        # Extract shipping fee from response
                        if 'data' in estimate_data and 'attributes' in estimate_data['data']:
                            if estimate_data['data']['type'] == 'shipment_estimates':
                                attrs = estimate_data['data']['attributes']
                                if 'total_cost' in attrs:
                                    shipping_fee = float(attrs['total_cost']) 
                                    total_shipping_fees += shipping_fee
                    else:
                        logger.error(f"Anka API request failed: {response.status_code} - {response.text}")
                        raise Exception(f"Anka API request failed: {response.status_code} - {response.text}")
                        
                except Exception as api_error:
                    logger.error(f"Error calling Anka API: {str(api_error)}", exc_info=True)
                    
                    raise Exception(f"Error calling Anka API: {str(api_error)}")

            # Update order with shipping information
            order.size = float(sum(data['total_size'] for data in owner_items.values()))
            order.country_code = address.country
            order.city = address.city
            order.state = address.state
            order.address = address.street_line_1
            order.shipping_fees = math.ceil(total_shipping_fees + (total_shipping_fees * 0.5))
            order.country_text = address.country
            order.save()

            logger.info(f"Successfully updated order {order.id} with shipping fees")

            return FeatureGenerateShippingFees(
                success=True,
                message="Success",
                order=order,
                shipping_estimate=shipping_estimate_response
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

