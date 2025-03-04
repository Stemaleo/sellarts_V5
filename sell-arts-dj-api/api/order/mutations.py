import graphene
import logging
from typing import Dict, List, Any, Optional, Union
from anka import models as anka_models
from order import models as order_models

import requests
from anka.fees import get_value
from . import types as types

logger = logging.getLogger(__name__)
def find_closest_higher_value(from_country: dict, to_country: str, weight: float) -> float:
    """Retourne le tarif pour un pays et un poids donnés."""
    
    if to_country not in from_country:
        raise KeyError(f"Destination country '{to_country}' not found in shipping rates")
    
    weight_list = list(from_country.get(to_country).keys())
    weight_list = sorted(weight_list)  # Trier la liste
    
    if weight in weight_list:
        return weight
    
    higher_values = [x for x in weight_list if x > weight]
    if not higher_values:
        raise ValueError(f"No shipping rate found for weight {weight} to {to_country}")
    
    return min(higher_values)



class FeatureGenerateShippingFees(graphene.Mutation):
    success: bool = graphene.Boolean()
    message: str = graphene.String()
    order: Optional[anka_models.Orders] = graphene.Field(types.OrdersType)

    class Arguments:
        order = graphene.ID(required=True)
        country = graphene.ID(required=True)

    @classmethod
    def mutate(cls, root, info, **kwargs) -> "FeatureGenerateShippingFees":
        try:
            logger.info(f"Generating shipping fees for order {kwargs['order']}")
            
            order: anka_models.Orders = anka_models.Orders.objects.get(id=kwargs["order"])
            country: order_models.Country = order_models.Country.objects.get(id=kwargs["country"])

            # Group order items by artwork owner
            owner_items: Dict[int, Dict[str, Any]] = {}
            order_items = anka_models.OrderItem.objects.filter(
                order=order.id
            ).select_related('art_work', 'art_work__owner')

            for order_item in order_items:
                artwork = order_item.art_work
                artwork_owner = artwork.owner

                if artwork_owner.id not in owner_items:
                    owner_items[artwork_owner.id] = {
                        'owner': artwork_owner,
                        'total_size': 0,
                        'artworks': []
                    }

                owner_items[artwork_owner.id]['artworks'].append(artwork)
                owner_items[artwork_owner.id]['total_size'] += (artwork.size + 3) * order_item.quantity

            # Calculate shipping fees for each owner's items
            total_shipping_fees: float = 0
            
            for owner_id, owner_data in owner_items.items():
                owner = owner_data['owner']
                total_size = owner_data['total_size']
                
                # Get origin country code from the owner
                origin_country_code: str = owner.country.code
                COUNTRY_CODES = {
    "Cape Verde": "CV",
    "Gambia": "GM",
    "Guinea Republic": "GN",
    "Guinea-Bissau": "GW",
    "Mali": "ML",
    "Mauritania": "MR",
    "Cote D Ivoire": "CI",
    "France": "FR",
    "Monaco": "MC",
    "Angola": "AO",
    "Benin": "BJ",
    "Botswana": "BW",
    "Burkina Faso": "BF",
    "Burundi": "BI",
    "Cameroon": "CM",
    "Central African Republic": "CF",
    "Chad": "TD",
    "Comoros": "KM",
    "Congo": "CG",
    "Djibouti": "DJ",
    "Eritrea": "ER",
    "Ethiopia": "ET",
    "Gabon": "GA",
    "Ghana": "GH",
    "Guinea-Equatorial": "GQ",
    "Kenya": "KE",
    "Lesotho": "LS",
    "Liberia": "LR",
    "Madagascar": "MG",
    "Malawi": "MW",
    "Mauritius": "MU",
    "Mayotte": "YT",
    "Morocco": "MA",
    "Mozambique": "MZ",
    "Namibia": "NA",
    "Niger": "NE",
    "Nigeria": "NG",
    "Reunion": "RE",
    "Island Of": "XX",  # No standard code for generic "Island Of"
    "Rwanda": "RW",
    "Sao Tome And Principe": "ST",
    "Seychelles": "SC",
    "Sierra Leone": "SL",
    "Somalia": "SO",
    "Somaliland": "SO",  # Somaliland uses Somalia's code as it's not internationally recognized
    "South Africa": "ZA",
    "South Sudan": "SS",
    "Sudan": "SD",
    "Swaziland": "SZ",
    "Tanzania": "TZ",
    "Togo": "TG",
    "Uganda": "UG",
    "Zambia": "ZM",
    "Zimbabwe": "ZW",
    "Albania": "AL",
    "Andorra": "AD",
    "Austria": "AT",
    "Belarus": "BY",
    "Belgium": "BE",
    "Bosnia And Herzegovina": "BA",
    "Bulgaria": "BG",
    "Croatia": "HR",
    "Cyprus": "CY",
    "Denmark": "DK",
    "Estonia": "EE",
    "Faroe Islands": "FO",
    "Finland": "FI",
    "Germany": "DE",
    "Gibraltar": "GI",
    "Greece": "GR",
    "Greenland": "GL",
    "Guernsey": "GG",
    "Hungary": "HU",
    "Iceland": "IS",
    "Ireland, Republic Of": "IE",
    "Italy": "IT",
    "Jersey": "JE",
    "Kosovo": "XK",
    "Latvia": "LV",
    "Lichtenstein": "LI",
    "Lithuania": "LT",
    "Luxembourg": "LU",
    "Macedonia, Republic Of": "MK",
    "Malta": "MT",
    "Moldova, Republic Of": "MD",
    "Montenegro, Republic Of": "ME",
    "Norway": "NO",
    "Poland": "PL",
    "Portugal": "PT",
    "Romania": "RO",
    "San Marino": "SM",
    "Serbia, Republic Of": "RS",
    "Slovakia": "SK",
    "Slovenia": "SI",
    "Spain": "ES",
    "Sweden": "SE",
    "Switzerland": "CH",
    "The Czech Republic": "CZ",
    "The Netherlands": "NL",
    "The Russian Federation": "RU",
    "Turkey": "TR",
    "Ukraine": "UA",
    "United Kingdom": "GB",
    "Vatican City": "VA",
    "Canada": "CA",
    "Congo, The Democratic Republic Of": "CD",
    "East Timor": "TL",
    "Mexico": "MX",
    "Saint Helena": "SH",
    "United States Of America": "US",
    "Algeria": "DZ",
    "Bahrain": "BH",
    "China, Peoples Republic": "CN",
    "Egypt": "EG",
    "Iraq": "IQ",
    "Israel": "IL",
    "Jordan": "JO",
    "Kuwait": "KW",
    "Lebanon": "LB",
    "Libya": "LY",
    "Oman": "OM",
    "Qatar": "QA",
    "Saudi Arabia": "SA",
    "Syria": "SY",
    "The Canary Islands": "ES",  # Part of Spain
    "Tunisia": "TN",
    "United Arab Emirates": "AE",
    "Yemen, Republic Of": "YE",
    "Afghanistan": "AF",
    "Armenia": "AM",
    "Azerbaijan": "AZ",
    "Bangladesh": "BD",
    "Bhutan": "BT",
    "Brunei": "BN",
    "Cambodia": "KH",
    "Commonwealth No. Mariana Islands": "MP",
    "Georgia": "GE",
    "Hong Kong": "HK",
    "India": "IN",
    "Indonesia": "ID",
    "Iran (Islamic Republic Of)": "IR",
    "Japan": "JP",
    "Kazakhstan": "KZ",
    "Korea, Republic Of (South)": "KR",
    "Korea, The D.P.R Of (North)": "KP",
    "Kyrgyzstan": "KG",
    "Lao Peoples Democratic Republic": "LA",
    "Macau": "MO",
    "Malaysia": "MY",
    "Maldives": "MV",
    "Mongolia": "MN",
    "Myanmar": "MM",
    "Nepal": "NP",
    "Pakistan": "PK",
    "Papua New Guinea": "PG",
    "Singapore": "SG",
    "Sri Lanka": "LK",
    "Taiwan": "TW",
    "Tajikistan": "TJ",
    "Thailand": "TH",
    "The Philippines": "PH",
    "Turkmenistan": "TM",
    "Uzbekistan": "UZ",
    "Vietnam": "VN",
    "American Samoa": "AS",
    "Anguilla": "AI",
    "Antigua": "AG",
    "Argentina": "AR",
    "Aruba": "AW",
    "Australia": "AU",
    "Bahamas": "BS",
    "Barbados": "BB",
    "Belize": "BZ",
    "Bermuda": "BM",
    "Bolivia": "BO",
    "Bonaire": "BQ",
    "Brazil": "BR",
    "Cayman Islands": "KY",
    "Chile": "CL",
    "Colombia": "CO",
    "Cook Islands": "CK",
    "Costa Rica": "CR",
    "Cuba": "CU",
    "Curacao": "CW",
    "Dominica": "DM",
    "Dominican Republic": "DO",
    "Ecuador": "EC",
    "El Salvador": "SV",
    "Falkland Islands": "FK",
    "Fiji": "FJ",
    "French Guyana": "GF",
    "Grenada": "GD",
    "Guadeloupe": "GP",
    "Guam": "GU",
    "Guatemala": "GT",
    "Guyana (British)": "GY",
    "Haiti": "HT",
    "Honduras": "HN",
    "Jamaica": "JM",
    "Kiribati": "KI",
    "Marshall Islands": "MH",
    "Martinique": "MQ",
    "Micronesia, Federated States Of": "FM",
    "Montserrat": "MS",
    "Nauru, Republic Of": "NR",
    "Nevis": "KN",  # Part of Saint Kitts and Nevis
    "New Caledonia": "NC",
    "New Zealand": "NZ",
    "Nicaragua": "NI",
    "Niue": "NU",
    "Palau": "PW",
    "Panama": "PA",
    "Paraguay": "PY",
    "Peru": "PE",
    "Puerto Rico": "PR",
    "Samoa": "WS",
    "Solomon Islands": "SB",
    "St. Barthelemy": "BL",
    "St. Eustatius": "BQ",  # Part of Bonaire, Sint Eustatius and Saba
    "St. Kitts": "KN",
    "St. Lucia": "LC",
    "St.Maarten": "SX",
    "St. Vincent": "VC",
    "Suriname": "SR",
    "Tahiti": "PF",  # French Polynesia
    "Tonga": "TO",
    "Trinidad And Tobago": "TT",
    "Turks And Caicos Islands": "TC",
    "Tuvalu": "TV",
    "Uruguay": "UY",
    "Vanuatu": "VU",
    "Venezuela": "VE",
    "Virgin Islands (British)": "VG",
    "Virgin Islands (Us)": "VI",
}
                # si = order_models.Country.objects.get(code='SN')
                # si_SI = si.shipping_rates
                # # Update shipping rates dictionary keys with country codes
                # updated_shipping_rates = {}
                # for country_name, rates in si_SI.items():
                #     if country_name in COUNTRY_CODES:
                #         # Replace country name with its code in the shipping rates dictionary
                #         country_code = COUNTRY_CODES[country_name]
                #         updated_shipping_rates[country_code] = rates
                #     else:
                #         # Keep original key if no matching code is found
                #         updated_shipping_rates[country_name] = rates
                
                # Replace the original shipping rates with the updated one
                # print(updated_shipping_rates, "updated_shipping_rates")
                    
                # si.shipping_rates = updated_shipping_rates
                # si.save()
                
                # Get destination country code from the country parameter
                destination_country_code: str = country.code
                print(origin_country_code, destination_country_code, "origin_country_code, destination_country_code")
                
                # Calculate shipping fee based on origin country
                if origin_country_code in ["BJ", "NG", "SN", "ZA", "CI"]:
                    # country_choice = {"BJ": BENIN}
                    
                    # country_choice = {"BJ": BENIN, "NG": NIGERIA, "SN": SENEGAL, "CI": SENEGAL}
                    print(total_size)
                    shipping_fee: float = float(get_value(origin_country_code, total_size))
                    print(shipping_fee, "shipping_fee")
                    # shipping_fee: float = 0
                    # shipping_fee: float = float(find_closest_higher_value(country_choice[origin_country_code], destination_country_code, total_size))
                    
                    
                else:
                    shipping_fee: float = 50000

                # Add shipping fee plus 30% to total
                total_shipping_fees += shipping_fee + (shipping_fee * 0.3)

            order.size = float(sum(data['total_size'] for data in owner_items.values()))
            order.country = country
            order.country_code = country.code
            order.shipping_fees = total_shipping_fees
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
    def mutate(cls, root, info, order) -> "FeatureVerifyShippingLabel":
        try:
            logger.info(f"Verifying shipping label for order {order}")
            
            order: anka_models.Orders = anka_models.Orders.objects.get(id=order)

            if not order.internal_reference:
                logger.warning(f"Order {order.id} has no internal reference")
                return FeatureVerifyShippingLabel(
                    success=False, message="Order has no internal reference"
                )

            headers: Dict[str, str] = {
                "Authorization": "Token FqvbsxHBxTKmbZyNcPvvNbFm",
                "Accept": "application/vnd.api+json",
                "Content-Type": "application/json",
            }

            # Get all shipping records for this order
            shipping_records = order_models.Shipping.objects.filter(order=order)
            
            shipping_data_list: List[Dict[str, Any]] = []
            
            for shipping in shipping_records:
                if not shipping.label_pdf or not shipping.invoice_pdf or not shipping.label:
                    logger.info(f"Fetching new shipping info for shipping record {shipping.id}")
                    
                    # Get the internal reference specific to this shipping/owner
                    shipping_reference: str = f"{order.internal_reference}_{shipping.user.id}"
                    
                    response = requests.get(
                        f"https://api.anka.fyi/v1/shipment/labels/{shipping_reference}",
                        headers=headers,
                    )

                    if response.status_code != 200:
                        logger.error(f"API request failed with status code {response.status_code}")
                        continue

                    shipping_data: Dict[str, Any] = response.json()

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
