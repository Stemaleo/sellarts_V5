import graphene
from query_optimizer.fields import DjangoConnectionField
from . import mutations as mutations
from . import queries as queries
from . import types as types


class Query(graphene.ObjectType):
    users = DjangoConnectionField(types.UsersType)
    
class Mutation(graphene.ObjectType):
    feature_delete_users = mutations.FeatureDeleteUsers.Field()




    