import graphene
import requests
from api import env
from . import meta as meta, models as models
import random
import string


def random_string(length=8):
    return "".join(random.choices(string.ascii_letters + string.digits, k=length))


class FeatureInitiatePayment(graphene.Mutation):
    success: bool = graphene.Boolean()
    message: str = graphene.String()
    payment_link: str = graphene.String()

    class Arguments:
        email = graphene.String(required=True)
        name = graphene.String(required=True)
        address = graphene.String(required=True)
        city = graphene.String(required=True)
        state = graphene.String(required=True)
        postal_code = graphene.String(required=True)
        phone_number = graphene.String(required=True)
        order = graphene.ID(required=True)

    class Meta:
        description = meta.feature_initiate_payment

    @classmethod
    def mutate(cls, root, info, **kwargs):
        headers = {
            "Authorization": "Token FqvbsxHBxTKmbZyNcPvvNbFm",
            "Accept": "application/vnd.api+json",
            "charset": "utf-8",
            "Content-Type": "application/json",  # Ajout pour spécifier que les données sont en JSON
        }

        print(kwargs)

        # models.Orders.objects.get(id=1)
        # Données à envoyer


        webhooks = {
            "data": {
                "type": "payment_webhooks",
                "attributes": {
                    "webhook_url": "http://dj-dev.sellarts.net/ipn/",
                    "webhook_enabled": True,
                },
            }
        }

        data = {
            "data": {
                "type": "payment_links",
                "attributes": {
                    "title": "Paiement d'Oeuvres d'art",
                    "description": "Paiements d'oeuvres d'art",
                    "amount_cents": 500,
                    "amount_currency": "EUR",
                    "shippable": True,
                    "reusable": False,
                    "callback_url": "http://dj-dev.sellarts.net/",
                    "order_reference": random_string(5),
                    "buyer": {
                        "contact": {
                            "fullname": kwargs["name"],
                            "phone_number": kwargs["phone_number"],
                            "email": kwargs["email"],
                        },
                        "address": {
                            "street_line_1": kwargs["address"],
                            "street_line_2": kwargs["address"],
                            "city": kwargs["city"],
                            "state": kwargs["state"],
                            "zip": kwargs["postal_code"],
                            "country": "FR",
                        },
                    },
                },
            }
        }

        # response = requests.post(
        #     "https://api.anka.fyi/v1/payment/links", headers=headers, json=data
        # )
        response = requests.post(
            "https://api.anka.fyi/v1/payment/links", headers=headers, json=data
        )

        content = response.json()

        print("Réponse:", content)


        response_webhooks = requests.post(
            "https://api.anka.fyi/v1/payment/webhook", headers=headers, json=webhooks
        )
        print(response_webhooks.json())
        # print(content.)
        return FeatureInitiatePayment(
            success=True, message="Success", payment_link=content["redirect_url"]
        )
