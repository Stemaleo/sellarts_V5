import graphene
from . import types as types, mutations as mutations
from query_optimizer.fields import DjangoConnectionField


class Query(graphene.ObjectType):
    orders = DjangoConnectionField(types.OrdersType)
    order_item = DjangoConnectionField(types.OrderItemType)


class Mutation(graphene.ObjectType):
    feature_generate_fees = mutations.FeatureGenerateShippingFees.Field()
