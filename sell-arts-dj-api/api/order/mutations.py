import graphene
# from . import meta as meta, models as models
from anka import models as anka_models
from order import models as order_models
from anka.fees import get_value
from . import types as types




class FeatureGenerateShippingFees(graphene.Mutation):
    success: bool = graphene.Boolean()
    message: str = graphene.String()
    order: anka_models.Orders = graphene.Field(types.OrdersType)
    

    class Arguments:
        order = graphene.ID(required=True)
        country = graphene.ID(required=True)
        

    @classmethod
    def mutate(cls, root, info, **kwargs):
        try: 
            
            order = anka_models.Orders.objects.get(id=kwargs['order'])
            country = order_models.Country.objects.get(id=kwargs['country'])
            order_items = anka_models.OrderItem.objects.filter(order=order.id).values('id', 'quantity', 'art_work')
            total_size = 0
            for order_item in order_items:
                artwork = anka_models.ArtWorks.objects.get(id=order_item['art_work'])
                print(artwork.size)
                total_size  += artwork.size  + 3
                print("ici")
                # order.country_code
                print(total_size, "total_size")
                order.size = float(total_size)
                order.country = country
                order.country_code = country.code
            # print(total_size, "total_size2")
        
            order.shipping_fees = float(get_value('FR', total_size) + (get_value('FR', total_size) * 0.3))
            
            # order.amount = float(order.total_amount)
            # #TODO add country code
            order.save()           

            return FeatureGenerateShippingFees(
                success=True, message="Success", order=order
            )
            
        except Exception as e:
            return FeatureGenerateShippingFees(
                success=False, message=str(e),
            )
            
            
            

          