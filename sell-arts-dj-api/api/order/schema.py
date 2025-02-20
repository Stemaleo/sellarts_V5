import graphene
from . import types as types
from query_optimizer.fields import DjangoConnectionField


class Query(graphene.ObjectType):
    orders = DjangoConnectionField(types.OrdersType)
    order_item = DjangoConnectionField(types.OrderItemType)


