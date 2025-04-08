import graphene
from . import types as types, mutations as mutations
from query_optimizer.fields import DjangoConnectionField
import googlemaps


# class LocationType(graphene.ObjectType):
#     name = graphene.String(description="Name of city or municipality")
#     country = graphene.String(description="Country")
#     state = graphene.String(description="State")
#     address = graphene.String(description="Full address")
#     coordinates = graphene.Field(OutputCoordinates, description="Coordinates")
#     type = graphene.String(description="Type of location (city or municipality)")

class OutputAddressType(graphene.ObjectType):
    country = graphene.String()
    state = graphene.String()
    city = graphene.String()
    zip = graphene.String()
    street_line_1 = graphene.String()
    street_line_2 = graphene.String()

class Query(graphene.ObjectType):
    orders = DjangoConnectionField(types.OrdersType)
    order_item = DjangoConnectionField(types.OrderItemType)
    country = DjangoConnectionField(types.CountryType)
    shipping = DjangoConnectionField(types.ShippingType)
    
    search_locations = graphene.List(
        OutputAddressType,
        location=graphene.String(required=True),
        description="Search for matching addresses worldwide"
    )

    def resolve_search_locations(self, info, location):
        try:
            gmaps = googlemaps.Client(key="AIzaSyB9i5aHRh6524RuFrDz368bk4PThuhxg7I")
            places_response = gmaps.places(query=location)

            results = []
            for place in places_response.get("results", []):
                
                place_id = place.get("place_id")
                if not place_id:
                    continue

                details = gmaps.place(place_id=place_id).get("result", {})
                address_components = details.get("address_components", [])
                formatted_address = details.get("formatted_address", "")

                address = {
                    "country": "",
                    "state": "",
                    "city": "",
                    "zip": "",
                    "street_line_1": "",
                    "street_line_2": ""
                }

                street_number = ""
                route = ""

                for comp in address_components:
                    types = comp.get("types", [])
                    if "country" in types:
                        address["country"] = comp.get("short_name")
                    elif "administrative_area_level_1" in types:
                        address["state"] = comp.get("long_name")
                    elif "locality" in types:
                        address["city"] = comp.get("long_name")
                    elif "postal_code" in types:
                        address["zip"] = comp.get("long_name")
                    elif "route" in types:
                        route = comp.get("long_name")
                    elif "street_number" in types:
                        street_number = comp.get("long_name")
                    elif "subpremise" in types:
                        address["street_line_2"] = comp.get("long_name")

                address["street_line_1"] = f"{street_number} {route}".strip() or formatted_address

                results.append(OutputAddressType(**address))

            return results

        except Exception as e:
            print(f"Error: {e}")
            return []


 
class Mutation(graphene.ObjectType):
    feature_generate_fees = mutations.FeatureGenerateShippingFees.Field()
    feature_verify_shipping_label = mutations.FeatureVerifyShippingLabel.Field()
