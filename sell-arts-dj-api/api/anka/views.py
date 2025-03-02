import logging
import json
import time
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.core.mail import send_mail
from anka import models as anka_models
from order import models as order_models
import requests
from django.template.loader import render_to_string
from django.utils.html import strip_tags

logger = logging.getLogger(__name__)

headers = {
    "Authorization": "Token FqvbsxHBxTKmbZyNcPvvNbFm",
    "Accept": "application/vnd.api+json",
    "charset": "utf-8",
    "Content-Type": "application/json",
}

@csrf_exempt
def instant_payment_notification(request):
    """Endpoint for handling instant payment notifications (IPN)."""

    if request.method == "POST":
        try:
            logger.error("Received IPN notification")
            data = json.loads(request.body.decode("utf-8"))["data"]
            logger.error(f"IPN data received: {data}")

            if data["type"] == "payment_links_orders":
                if data["attributes"]["status"] == "captured":
                    reference: str = data["attributes"]["internal_reference"]
                    logger.error(f"Processing captured payment for reference: {reference}")
                    
                    order = anka_models.Orders.objects.get(
                        id=int(reference.split("SELLARTS")[-1])
                    )
                    logger.error(f"Found order: {order.id}")

                    order.status = "PENDING"
                    order.payment_status = "SUCCESS"
                    order.save()
                    logger.error(f"Updated order {order.id} status to PENDING and payment_status to SUCCESS")

                    # Group order items by artwork owner
                    owner_items = {}
                    order_items = anka_models.OrderItem.objects.filter(
                        order=order.id
                    ).select_related('art_work', 'art_work__owner', 'art_work__owner__artist_profile')
                    logger.error(f"Processing {order_items.count()} items for shipping")

                    for order_item in order_items:
                        artwork = order_item.art_work
                        artwork_owner = artwork.owner
                        
                        # Update stock
                        logger.error(f"Updating stock for artwork {artwork.id} from {artwork.stock} to {artwork.stock - order_item.quantity}")
                        artwork.stock -= order_item.quantity
                        artwork.save()

                        if artwork_owner.id not in owner_items:
                            owner_items[artwork_owner.id] = {
                                'owner': artwork_owner,
                                'items': [],
                                'total_weight': 0,
                                'artworks': []
                            }

                        owner_items[artwork_owner.id]['items'].append({
                            "quantity": order_item.quantity,
                            "price_currency": "XOF",
                            "hscode": "6404.20.9000",
                            "description": f"Original {artwork.title} artwork by {artwork_owner.name}", 
                            "weight_grams": int(artwork.size * 1000),
                            "price_cents": int(float(artwork.price) * 100),
                        })
                        owner_items[artwork_owner.id]['artworks'].append(artwork)
                        owner_items[artwork_owner.id]['total_weight'] += int(artwork.size * 1000)

                    # Generate shipping label for each owner's items
                    logger.error(f"Generating shipping labels for {len(owner_items)} owners")
                    all_shipping_successful = True
                    
                    for owner_id, owner_data in owner_items.items():
                        logger.error(f"Processing shipping for owner {owner_id}")
                        owner = owner_data['owner']
                        owner_profile = owner.artist_profile

                        shipper_address = {
                            "street_line_1": owner_profile.location or "Not Specified",
                            "street_line_2": owner_profile.location or "Not Specified", 
                            "city": owner_profile.location or "Abidjan",
                            "state": owner_profile.location or "Abidjan",
                            "zip": "00225",
                            "country": "CI",
                        }
                        # Calculate package dimensions based on artwork sizes
                        total_height = 0
                        max_length = 0
                        max_width = 0
                        
                        for item in owner_data['items']:
                            artwork = next((a for a in owner_data['artworks'] if a.title in item['description']), None)
                            if artwork:
                                logger.error(f"Calculating dimensions for artwork {artwork.id}")
                                
                                item_height = artwork.height
                                item_length = artwork.width
                                item_width = artwork.width * 0.1
                                
                                total_height += item_height * item['quantity']
                                max_length = max(max_length, item_length)
                                max_width = max(max_width, item_width)

                        total_height += 5
                        max_length += 5
                        max_width += 5
                        
                        logger.error(f"Final package dimensions: {total_height}x{max_length}x{max_width}cm")
                        logger.error(f"buyer: {data['attributes']['buyer']}")

                        shipment_data = {
                            "data": {
                                "type": "shipment_labels",
                                "attributes": {
                                    "package": {
                                        "items": owner_data['items'],
                                        "dimensions": {
                                            "height_cm": int(total_height),
                                            "length_cm": int(max_length),
                                            "weight_grams": owner_data['total_weight'],
                                            "width_cm": int(max_width),
                                        },
                                        "description": "Original Artwork Package Professional Fine Art Shipping",
                                        "package_content": "Original Paintings Professional Artwork Secure Packaging",
                                    },
                                    "internal_reference": f"{data['attributes']['internal_reference']}_{owner_id}",
                                    "duty_code": "ddps",
                                    "currency": "XOF",
                                    "shipper": {
                                        "contact": {
                                            "fullname": owner.name,
                                            "phone_number": "+225 0505050505",
                                            "email": owner.email,
                                        },
                                        "address": shipper_address,
                                    },
                                    "recipient": data["attributes"]["buyer"],
                                },
                            }
                        }

                        # Create shipping label
                        logger.error(f"Creating shipping label for owner {owner_id}")
                        response_shipping = requests.post(
                            "https://api.anka.fyi/v1/shipment/labels", 
                            headers=headers, 
                            json=shipment_data
                        )

                        shipping_response = response_shipping.json()
                        logger.error(response_shipping.content)
                        if shipping_response.get("status") == "queued":
                            logger.error("Successfully queued shipping label, waiting 5 seconds before verifying...")
                            time.sleep(5)  # Wait 5 seconds
                            
                            # Verify shipping label status
                            response_shipping_label = requests.get(
                                f"https://api.anka.fyi/v1/shipment/labels/{shipping_response.get('reference')}", 
                                headers=headers
                            )

                            shipping_label_data = response_shipping_label.json()
                            logger.error("Successfully retrieved shipping label details")
                            
                            if shipping_label_data['data']['attributes']['status'] == 'processed':
                                # Create shipping record
                                shipping = order_models.Shipping.objects.create(
                                    order=order,
                                    user=owner,
                                    label=shipping_label_data['data']['attributes'].get('provider_reference'),
                                    label_pdf=shipping_label_data['data']['attributes']['package']['pdf'].get('label'),
                                    invoice_pdf=shipping_label_data['data']['attributes']['package']['pdf'].get('invoice')
                                )
                                logger.error(f"Created shipping record {shipping.id}")

                                # Send email to artwork owner
                                logger.error(f"Sending shipping notification email to owner {owner.email}")
                                context = {
                                    'user': owner,
                                    'order': order,
                                    'artworks': owner_data['artworks'],
                                    'shipping_label': shipping_label_data['data']['attributes']['package']['pdf'].get('label'),
                                    'shipping_invoice': shipping_label_data['data']['attributes']['package']['pdf'].get('invoice')
                                }

                                html_message = render_to_string('shipping_notification.html', context)
                                plain_message = strip_tags(html_message)

                                try:
                                    send_mail(
                                        subject="New Order Shipping Request",
                                        message=plain_message,
                                        from_email=settings.DEFAULT_FROM_EMAIL,
                                        recipient_list=[owner.email],
                                        html_message=html_message,
                                        fail_silently=False,
                                    )
                                    logger.error(f"Successfully sent shipping notification email to {owner.email}")
                                except Exception as e:
                                    logger.error(f"Failed to send shipping notification email to owner {owner.id}: {str(e)}")
                                    all_shipping_successful = False
                            else:
                                logger.error(f"Shipping label not processed yet for owner {owner.id}")
                                all_shipping_successful = False
                        else:
                            logger.error(f"Failed to queue shipping label for owner {owner.id}: {response_shipping.content}")
                            all_shipping_successful = False

                    # Send confirmation email to customer only after all shipping labels are created
                    if all_shipping_successful:
                        try:
                            logger.error(f"Sending confirmation email to {order.owner.email}")
                            subject = "Thank You for Your Order!"
                            
                            # Get order items for email template
                            order_items = anka_models.OrderItem.objects.filter(
                                order=order.id
                            ).select_related('art_work')
                            logger.error(f"Found {order_items.count()} order items")

                            context = {
                                'user': order.owner,
                                'order': order,
                                'order_items': order_items
                            }

                            html_message = render_to_string('order_confirmation.html', context)
                            plain_message = strip_tags(html_message)

                            send_mail(
                                subject,
                                plain_message,
                                settings.DEFAULT_FROM_EMAIL,
                                [order.owner.email],
                                html_message=html_message,
                                fail_silently=False,
                            )
                            logger.error("Confirmation email sent successfully")
                        except Exception as e:
                            logger.error(f"Failed to send confirmation email: {str(e)}")

            return JsonResponse(
                {"success": True, "message": "Notification received"}, status=200
            )

        except json.JSONDecodeError:
            logger.error("Invalid JSON received in IPN")
            return JsonResponse(
                {"success": False, "message": "Invalid JSON"}, status=400
            )

        except Exception as e:
            logger.error("Error processing IPN")
            return JsonResponse(
                {"success": False, "message": "Internal Server Error"}, status=500
            )
    else:
        logger.error(f"Invalid request method: {request.method}")
        return JsonResponse(
            {"success": False, "message": "Invalid request method"}, status=405
        )
