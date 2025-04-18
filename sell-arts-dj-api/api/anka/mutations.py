import graphene
import requests
import random
import string
import logging
import traceback
from . import meta, models, fees

# API configuration
from api.secret import ANKA_API_BASE_URL, ANKA_API_TOKEN, SELLARTS_BASE_URL, SELLARTS_API_URL

def random_string(length=8):
    return "".join(random.choices(string.ascii_letters + string.digits, k=length))

class FeatureInitiatePayment(graphene.Mutation):
    success = graphene.Boolean()
    message = graphene.String()
    payment_link = graphene.String()

    class Arguments:
        email = graphene.String(required=True)
        name = graphene.String(required=True)
        address = graphene.String(required=True)
        city = graphene.String(required=True)
        state = graphene.String(required=True)
        postal_code = graphene.String(required=True)
        phone_number = graphene.String(required=True)
        is_the_same_addres = graphene.Boolean(default_value=False)
        currency = graphene.String(default_value="XOF")
        order = graphene.ID(required=True)

    class Meta:
        description = meta.feature_initiate_payment

    @classmethod
    def mutate(cls, root, info, **kwargs):
        try:
            headers = {
                "Authorization": f"Token {ANKA_API_TOKEN}",
                "Accept": "application/vnd.api+json",
                "Content-Type": "application/json"
            }

            order = models.Orders.objects.get(id=kwargs['order'])
            
            # Update order details
            order.city = kwargs['city']
            order.phone = kwargs['phone_number']
            order.state = kwargs['state']
            order.address = kwargs['address']
            
            internal_reference = random_string(5) + "SELLARTS" + str(order.id)
            order.internal_reference = internal_reference

            # Prepare payment data
            data = {
                "data": {
                    "type": "payment_links",
                    "attributes": {
                        "title": "Paiement d'Oeuvres d'art",
                        "description": "Paiements d'oeuvres d'art",
                        "amount_cents": int(round(float(order.total_amount) + float((order.shipping_fees or 0)))),
                        "amount_currency": kwargs['currency'],
                        "shippable": True,
                        "reusable": False,
                        "callback_url": f"{SELLARTS_BASE_URL}/orders/{order.id}",
                        "order_reference": internal_reference,
                        # "buyer": {
                        #     "contact": {
                        #         "fullname": kwargs["name"],
                        #         "phone_number": kwargs["phone_number"],
                        #         "email": kwargs["email"],
                        #     },
                        #     "address": {
                        #         "street_line_1": kwargs["address"],
                        #         "street_line_2": kwargs["address"],
                        #         # "city": kwargs["city"],
                        #         "city": kwargs["city"],
                        #         "state": kwargs["state"],
                        #         "zip": kwargs["postal_code"],
                        #         "country": order.country_code,
                        #     },
                        # },
                    },
                }
            }

            # respons3 = requests.get(
            #     f"{ANKA_API_BASE_URL}/shipment/labels/n9nSNSELLARTS36960282_706",
            #     headers=headers,
            # )
            
            # print(respons3.content, respons3.status_code, respons3.headers)
            
            # Save order before making API call
            order.save()

            # Make payment request
            response = requests.post(
                f"{ANKA_API_BASE_URL}/payment/links",
                headers=headers,
                json=data
            )
            print(response.content, response.status_code, response.headers)
            if not response.ok:
                return FeatureInitiatePayment(
                    success=False,
                    message=f"Payment request failed: {response.status_code}"
                )

            content = response.json()

            # Setup webhooks
            webhooks = {
                "data": {
                    "type": "payment_webhooks",
                    "attributes": {
                        "webhook_url": f"{SELLARTS_API_URL}/ipn/",
                        "webhook_enabled": True,
                    },
                }
            }

            requests.post(
                f"{ANKA_API_BASE_URL}/payment/webhook",
                headers=headers,
                json=webhooks
            )

            return FeatureInitiatePayment(
                success=True,
                message="Success",
                payment_link=content.get("redirect_url")
            )
# "n9nSNSELLARTS36960282_715"

        except models.Orders.DoesNotExist:
            logging.error(traceback.format_exc())
            return FeatureInitiatePayment(
                success=False,
                message="Order not found"
            )
        except Exception as e:
            logging.error(traceback.format_exc())
            return FeatureInitiatePayment(
                success=False,
                message=str(e)
            )
