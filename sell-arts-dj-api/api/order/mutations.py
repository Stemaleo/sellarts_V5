import graphene
import logging
from anka import models as anka_models
from order import models as order_models
import requests
from anka.fees import get_value
from . import types as types

logger = logging.getLogger(__name__)

class FeatureGenerateShippingFees(graphene.Mutation):
    success = graphene.Boolean()
    message = graphene.String()
    order = graphene.Field(types.OrdersType)

    class Arguments:
        order = graphene.ID(required=True)
        country = graphene.ID(required=True)

    @classmethod
    def mutate(cls, root, info, **kwargs):
        try:
            logger.info(f"Generating shipping fees for order {kwargs['order']}")
            
            order = anka_models.Orders.objects.get(id=kwargs["order"])
            country = order_models.Country.objects.get(id=kwargs["country"])
            
            order_items = anka_models.OrderItem.objects.filter(order=order.id).values(
                "id", "quantity", "art_work"
            )
            
            total_size = 0
            for order_item in order_items:
                artwork = anka_models.ArtWorks.objects.get(id=order_item["art_work"])
                logger.debug(f"Processing artwork {artwork.id} with size {artwork.size}")
                total_size += artwork.size + 3

            logger.info(f"Total package size calculated: {total_size}")
            
            order.size = float(total_size)
            order.country = country
            order.country_code = country.code
            
            shipping_fee = float(get_value("FR", total_size))
            order.shipping_fees = shipping_fee + (shipping_fee * 0.3)
            
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
    def mutate(cls, root, info, order):
        try:
            logger.info(f"Verifying shipping label for order {order}")
            
            order = anka_models.Orders.objects.get(id=order)

            if not order.internal_reference:
                logger.warning(f"Order {order.id} has no internal reference")
                return FeatureVerifyShippingLabel(
                    success=False, message="Order has no internal reference"
                )

            headers = {
                "Authorization": "Token FqvbsxHBxTKmbZyNcPvvNbFm",
                "Accept": "application/vnd.api+json",
                "Content-Type": "application/json",
            }

            # Get all shipping records for this order
            shipping_records = order_models.Shipping.objects.filter(order=order)
            
            shipping_data_list = []
            
            for shipping in shipping_records:
                if not shipping.label_pdf or not shipping.invoice_pdf or not shipping.label:
                    logger.info(f"Fetching new shipping info for shipping record {shipping.id}")
                    
                    # Get the internal reference specific to this shipping/owner
                    shipping_reference = f"{order.internal_reference}_{shipping.user.id}"
                    
                    response = requests.get(
                        f"https://api.anka.fyi/v1/shipment/labels/{shipping_reference}",
                        headers=headers,
                    )

                    if response.status_code != 200:
                        logger.error(f"API request failed with status code {response.status_code}")
                        continue

                    shipping_data = response.json()

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
