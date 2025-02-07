import logging
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

logger = logging.getLogger(__name__)

@csrf_exempt  # Désactive la protection CSRF si nécessaire (ex: webhook)
def instant_payment_notification(request):
    """Endpoint for handling instant payment notifications (IPN)."""
    
    logger.warning(request)

    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Invalid request method"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8"))  # Convertit le corps en JSON
        logger.warning("Received Instant Payment Notification: %s", data)

        return JsonResponse({"success": True, "message": "Notification received"}, status=200)

    except json.JSONDecodeError:
        logger.error("Invalid JSON received in IPN")
        return JsonResponse({"success": False, "message": "Invalid JSON"}, status=400)

    except Exception as e:
        logger.exception("Error processing IPN")
        return JsonResponse({"success": False, "message": "Internal Server Error"}, status=500)
