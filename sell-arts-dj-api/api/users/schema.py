import graphene
from . import mutations as mutations
    

class Mutation(graphene.ObjectType):
    feature_delete_users = mutations.FeatureDeleteUsers.Field()

