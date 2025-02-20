import graphene
# from . import meta as meta, models as models
from anka import models as anka_models
from anka.fees import get_value
from . import types as types




class FeatureGenerateShippingFees(graphene.Mutation):
    success: bool = graphene.Boolean()
    message: str = graphene.String()
    order: anka_models.Orders = graphene.Field(types.OrdersType)
    

    class Arguments:
        order = graphene.ID(required=True)
        

    @classmethod
    def mutate(cls, root, info, **kwargs):
        try: 
            
            order = anka_models.Orders.objects.get(id=kwargs['order'])
            order_items = anka_models.OrderItem.objects.filter(order=order.id).values('id', 'quantity', 'art_work')
            total_size = 0
            for order_item in order_items:
                artwork = anka_models.ArtWorks.objects.get(id=order_item['art_work'])
                print(artwork.size)
                total_size  += (artwork.size or 0) + 3
                print("ici")
                
        
            order.shipping_fees = get_value(total_size, order.country_code) + (get_value(total_size, order.country_code) * 0.3)
            print("erer")
            order.amount = order.total_amount
            order.total_amount = order.total_amount + (get_value(total_size, order.country_code) + (get_value(total_size, order.country_code) * 0.3))
            order.size = total_size
            print("erer")
            order.save()           

            return FeatureGenerateShippingFees(
                success=True, message="Success", order=order
            )
            
        except Exception as e:
            return FeatureGenerateShippingFees(
                success=False, message=str(e),
            )
            
            
            

          