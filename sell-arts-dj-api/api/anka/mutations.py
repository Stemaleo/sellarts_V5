import graphene
import requests
from api import env
from . import meta as meta, models as models
import random
import string
import logging


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

        logging.warning(kwargs)

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
                    "amount_cents": 50000,
                    "amount_currency": "XOF",
                    "shippable": True,
                    "reusable": False,
                    "callback_url": "http://dev.sellarts.net/",
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
                            "country": "CI",
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

        logging.warning("Réponse:", content)

        response_webhooks = requests.post(
            "https://api.anka.fyi/v1/payment/webhook", headers=headers, json=webhooks
        )
        print(response_webhooks.json())
        logging.warning(response_webhooks.json())

        {
            "data": {
                "type": "payment_links_orders",
                "attributes": {
                    "status": "captured",
                    "internal_reference": "K9ZbG",
                    "payee_total_cents": 50000,
                    "payee_total_currency": "XOF",
                    "platform_total_cents": 7622,
                    "platform_total_currency": "EUR",
                    "provider_total_cents": 50000,
                    "provider_total_currency": "XOF",
                    "payment_link": {
                        "title": "Paiement d'Oeuvres d'art",
                        "amount_cents": 50000,
                        "amount_currency": "XOF",
                        "callback_url": "http://dev.sellarts.net/",
                        "description": "Paiements d'oeuvres d'art",
                        "payment_token": "1R6Y8PUQ",
                        "reusable": False,
                        "shippable": True,
                        "source": "api",
                        "redirect_url": "https://pay.anka.fyi/1R6Y8PUQ?reference=K9ZbG&token=PAY-72PBHBQF",
                    },
                    "buyer": {
                        "contact": {
                            "fullname": "zejkfjke",
                            "phone_number": "+225 05 04 84 1019",
                            "email": "severindindji68@gmail.com",
                        },
                        "address": {
                            "street_line_1": "JDJZJJDZHJ  UIZD UZD",
                            "street_line_2": "sjkkjfjjk",
                            "city": "iozodko",
                            "state": "okzdo",
                            "zip": "jkfzidok",
                            "country": "CI",
                        },
                    },
                },
            }
        }
        # print(content.)
        return FeatureInitiatePayment(
            success=True, message="Success", payment_link=content["redirect_url"]
        )
