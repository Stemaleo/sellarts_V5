import graphene
from . import mutations as mutations
from . import queries as queries
from . import types as types
from query_optimizer.fields import DjangoConnectionField
class Query(graphene.ObjectType):
    messages = DjangoConnectionField(types.MessagesType)


    

class Mutation(graphene.ObjectType):
    feature_send_message = mutations.FeatureSendMessage.Field()

