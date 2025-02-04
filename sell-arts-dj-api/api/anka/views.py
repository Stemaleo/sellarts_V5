import logging

# Create your views here.
def instant_payment_notification(request):
    logging.warning("I receiveid it")
    print(request)
    logging.warning(request)