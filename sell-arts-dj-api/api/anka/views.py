import logging
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.core.mail import send_mail
from anka import models as anka_models
import requests

logger = logging.getLogger(__name__)


# shipment_data = {
#     "data": {
#       "type": "shipment_labels",
#       "attributes": {
#         "package": {


#           "items": [
#             {
#               "quantity": 2,
#               "price_currency": "EUR",
#               "hscode": "6204.43.4040",
#               "description": "Women Clothing - Short dresses - Multicolour -  Ankara",
#               "weight_grams": 500,
#               "price_cents": 1720
#             },
#             {
#               "quantity": 1,
#               "price_currency": "EUR",
#               "hscode": "6404.20.9000",
#               "description": "African beaded leather sandals",
#               "weight_grams": 1500,
#               "price_cents": 800
#             }
#           ],
#           "dimensions": {
#             "height_cm": 20,
#             "length_cm": 20,
#             "weight_grams": 2000,
#             "width_cm": 25
#           },
#           "description": "Fish/Vegetables/Crayfish/Mixed Spices"
#         },
#         "internal_reference": random_string(8),
#         "duty_code": "ddps",
#         "currency": "EUR",
#         "shipper": {
#           "contact": {
#             "email": "jane@doe.com",
#             "fullname": "Jane R. Doe",
#             "phone_number": "+2349038755333"
#           },
#           "address": {
#             "country": "CI",
#             "state": "Abidjan",
#             "street_line_1": "2 Abunama Close",
#             "city": "Abidjan",
#             "zip": "00225",
#             "street_line_2": "Apt. 101"
#           }
#         },
#         "recipient": {
#           "contact": {
#             "email": "john@doe.com",
#             "fullname": "John Z. Doe",
#             "phone_number": "+447865015511"
#           },
#           "address": {
#             "country": "FR",
#             "state": "",
#             "street_line_1": "81 Hardshaw Street",
#             "city": "Paris",
#             "zip": "00233",
#             "street_line_2": ""
#           }
#         }
#       }
#     }
#   }

headers = {
    "Authorization": "Token FqvbsxHBxTKmbZyNcPvvNbFm",
    "Accept": "application/vnd.api+json",
    "charset": "utf-8",
    "Content-Type": "application/json",  # Ajout pour spécifier que les données sont en JSON
}
@csrf_exempt  # Désactive la protection CSRF si nécessaire (ex: webhook)
def instant_payment_notification(request):
    """Endpoint for handling instant payment notifications (IPN)."""

    # logger.warning(request)
    # logger.warning(request.__dict__)

    # request.post
    # data = request.__dict__['data']

    # if data['attributes']['status'] == 'captured':
    #     anka_models.Orders

    if request.method == "POST":

        try:
            data = json.loads(request.body.decode("utf-8"))[
                "data"
            ]  # Convertit le corps en JSON
            # logger.warning("Received Instant Payment Notification: %s", data)

            if data["type"] == "payment_links_orders":
                if data["attributes"]["status"] == "captured":
                    reference: str = data["attributes"]["internal_reference"]
                    order = anka_models.Orders.objects.get(
                        id=int(reference.split("SELLARTS")[-1])
                    )
                    # Send confirmation email to user
                    try:
                        subject = "Payment Confirmation - Your Order Has Been Received"
                        message = f"""
Dear {order.owner.name},

Thank you for your purchase! We're pleased to confirm that your payment has been successfully processed.

Your order reference number is:  {order.id}

We will notify you once your order has been shipped.

Best regards,
The SellArts Team
"""
                        from_email = settings.DEFAULT_FROM_EMAIL
                        recipient_list = [order.owner.email]
                        
                        send_mail(
                            subject,
                            message,
                            from_email,
                            recipient_list,
                            fail_silently=False,
                        )
                    except Exception as e:
                        logger.error(f"Failed to send confirmation email: {str(e)}")
                        
                        
                    # logger.warning("Ref: %s", reference.split('SELLARTS'))
                    # logger.warning("Ref: %s", reference.split('SELLARTS'))

                    order.status = "PENDING"
                    order.payment_status = "SUCCESS"
                    order.save()
                    items = []
                    order_items = anka_models.OrderItem.objects.filter(
                        order=order.id
                    ).values("id", "quantity", "art_work")
                    for order_item in order_items:
                        artwork = anka_models.ArtWorks.objects.get(
                            id=order_item["art_work"]
                        )
                        artwork.stock -= order_item["quantity"]
                        artwork.save()

                        items.append(
                            {
                                "quantity": order_item["quantity"],
                                "price_currency": "XOF",
                                "hscode": "6204.43.4040",
                                "description": artwork.description,
                                "weight_grams": artwork.size * 1000,
                                "price_cents": artwork.price,
                            }
                        )
                        
                    owner: anka_models.Users =  order.owner
                    owner_profile: anka_models.ArtistProfiles =  owner.artist_profile
                    shipment_data = {
                        "data": {
                            "type": "shipment_labels",
                            "attributes": {
                                "package": {
                                    "items": items,
                                    "dimensions": {
                                        "height_cm": 10,
                                        "length_cm": 20,
                                        "weight_grams": order.size,
                                        "width_cm": 25,
                                    },
                                    "description": "Arts Works",
                                },
                                "internal_reference": data["attributes"][
                                    "internal_reference"
                                ],
                                "duty_code": "ddps",
                                "currency": "XOF",
                                "shipper": {
                                    "contact": {
                                        "fullname": owner.name,
                                        "phone_number": "+225 0505050505",
                                        "email": owner.email,
                                    },
                                    "address": {
                                        "street_line_1": owner_profile.location or "",
                                        "street_line_2": owner_profile.location or "",
                                        "city": owner_profile.location or "",
                                        "state": owner_profile.location or "",
                                        "zip": "00225",
                                        "country": "CI",
                                    },
                                },
                                "recipient": data["attributes"]["buyer"],
                            },
                        }
                    }
                    

                    logger.warning("Received Instant Payment Notification: ici1")
                    response_shipping = requests.post(
                        "https://api.anka.fyi/v1/shipment/labels", headers=headers, json=shipment_data
                    )
                    logger.warning("Received Instant Payment Notification: ici2")
                    # print(response_shipping)

                    response_shipping_label =  requests.get(
                        "https://api.anka.fyi/v1/shipment/labels/"+ data["attributes"][
                                    "internal_reference"
                                ], headers=headers
                    )
                    logger.warning("Received Instant Payment Notification: ici3")
                    
                    # print(response_shipping_label)
                    shipment_label_content = response_shipping_label.json()
                    logger.warning("Received Instant Payment Notification: ici4")
                    # print(shipment_label_content)
            return JsonResponse(
                {"success": True, "message": "Notification received"}, status=200
            )

        except json.JSONDecodeError:
            logger.error("Invalid JSON received in IPN")
            return JsonResponse(
                {"success": False, "message": "Invalid JSON"}, status=400
            )

        except Exception as e:
            logger.exception("Error processing IPN")
            return JsonResponse(
                {"success": False, "message": "Internal Server Error"}, status=500
            )
    else:
        return JsonResponse(
            {"success": False, "message": "Invalid request method"}, status=405
        )
