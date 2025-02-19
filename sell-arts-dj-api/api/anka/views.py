import logging
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from anka import models as anka_models
logger = logging.getLogger(__name__)

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
            data = json.loads(request.body.decode("utf-8"))['data']  # Convertit le corps en JSON
            logger.warning("Received Instant Payment Notification: %s", data)
            
            if data['type'] == 'payment_links_orders':
                if data['attributes']['status'] == 'captured':
                    logger.warning("Ref: %s", reference.split('SELLARTS'))
                    logger.warning("Ref: %s", reference.split('SELLARTS'))
                    reference: str =  data['attributes']['internal_reference']            
                    order = anka_models.Orders.objects.get(id=int(reference.split('SELLARTS')[-1]))
                    order.status = 'PENDING'
                    order.payment_status = 'SUCCESS'
                    order.save()

                    order_items = anka_models.OrderItem.objects.filter(order=order.id).values('id', 'quantity', 'art_work')
                    for order_item in order_items:
                        artwork = anka_models.ArtWorks.objects.get(id=order_item['art_work'])
                        artwork.stock -= order_item['quantity']
                        artwork.save()
                        
                        # Create a new order item in the platform's system
                        # anka_models.create_platform_order_item(data['id'], order_item['id'])
                        
                        # Update the platform's order status
                        # anka_models.update_platform_order_status(data['id'])
                        
                        # Create a new order in the platform's system
                        # anka_models.create_platform_order(data['id'])
                        
                        # Send email confirmation to customer
                        # anka_models.send_order_confirmation_email(data['id'])
                        
                        # Analyze payment data and update inventory
                        # anka_models.update_inventory(data['id'])
                        
                    # Send email confirmation to customer
                    # anka_models.send_order_confirmation_email(data['id'])
                    # Analyze payment data and update inventory
                    # anka_models.update_inventory(data['id'])
                    # Create an order in the platform's system
                    # anka_models.create_platform_order(data['id'])
             
            return JsonResponse({"success": True, "message": "Notification received"}, status=200)

        except json.JSONDecodeError:
            logger.error("Invalid JSON received in IPN")
            return JsonResponse({"success": False, "message": "Invalid JSON"}, status=400)

        except Exception as e:
            logger.exception("Error processing IPN")
            return JsonResponse({"success": False, "message": "Internal Server Error"}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Invalid request method"}, status=405)
