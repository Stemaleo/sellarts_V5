import graphene
import requests
from api import env
from . import meta as meta, models as models
import random
import string
import logging
from . import fees as fees





def random_string(length=8):
    return "".join(random.choices(string.ascii_letters + string.digits, k=length))




 ## POST Label - curl
#   curl -X "POST" "https://api.anka.local/v1/shipment/labels" \
#        -H 'Authorization: Token 1234FHnZTzcEdRzoWXtabcd' \
#        -H 'Content-Type: application/json' \
#        -d $'{
           
shipment_data = {
    "data": {
      "type": "shipment_labels",
      "attributes": {
        "package": {
          "items": [
            {
              "quantity": 2,
              "price_currency": "EUR",
              "hscode": "6204.43.4040",
              "description": "Women Clothing - Short dresses - Multicolour -  Ankara",
              "weight_grams": 500,
              "price_cents": 1720
            },
            {
              "quantity": 1,
              "price_currency": "EUR",
              "hscode": "6404.20.9000",
              "description": "African beaded leather sandals",
              "weight_grams": 1500,
              "price_cents": 800
            }
          ],
          "dimensions": {
            "height_cm": 20,
            "length_cm": 20,
            "weight_grams": 2000,
            "width_cm": 25
          },
          "description": "Fish/Vegetables/Crayfish/Mixed Spices"
        },
        "internal_reference": random_string(8),
        "duty_code": "ddps",
        "currency": "EUR",
        "shipper": {
          "contact": {
            "email": "jane@doe.com",
            "fullname": "Jane R. Doe",
            "phone_number": "+2349038755333"
          },
          "address": {
            "country": "CI",
            "state": "Abidjan",
            "street_line_1": "2 Abunama Close",
            "city": "Abidjan",
            "zip": "00225",
            "street_line_2": "Apt. 101"
          }
        },
        "recipient": {
          "contact": {
            "email": "john@doe.com",
            "fullname": "John Z. Doe",
            "phone_number": "+447865015511"
          },
          "address": {
            "country": "FR",
            "state": "",
            "street_line_1": "81 Hardshaw Street",
            "city": "Paris",
            "zip": "00233",
            "street_line_2": ""
          }
        }
      }
    }
  }




# ZA001277454S, 

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
        is_the_same_addres = graphene.Boolean(default_value=False)
        curency = graphene.String(default_value="XOF")
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
        order = models.Orders.objects.get(id=kwargs['order'])
        order.city = kwargs['city']
        order.phone = kwargs['phone_number']
        order.state = kwargs['state']
        order.address = kwargs['address']
        # order.country_code = kwargs['phone_number']
        
        internal_reference = random_string(5)+"SELLARTS"+str(order.id)
        webhooks = {
            "data": {
                "type": "payment_webhooks",
                "attributes": {
                    "webhook_url": "https://dj-dev.sellarts.net/ipn/",
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
                    "amount_cents": int(round(float(order.total_amount) + float((order.shipping_fees or 0)))),
                    "amount_currency": "XOF",
                    "shippable": True,
                    "reusable": False,
                    "callback_url": "https://dev.sellarts.net/",
                    "order_reference": internal_reference,
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
        
        # response_shipping = requests.post(
        #     "https://api.anka.fyi/v1/shipment/labels", headers=headers, json=shipment_data
        # )

        # print(response_shipping)
        # shipment_content = response_shipping.json()
        # print("SHIPPING LABEL", shipment_content)  
        # label = "5Ga0R99r"
        
        # response_shipping_label =  requests.get(
        #     "https://api.anka.fyi/v1/shipment/labels/"+label, headers=headers
        # )
        
        # print(response_shipping_label)
        # shipment_label_content = response_shipping_label.json()
        # print(shipment_label_content)
        return FeatureInitiatePayment(
            success=True, message="Success", payment_link=content["redirect_url"]
        )
        



