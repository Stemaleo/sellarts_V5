import graphene
from . import mutations as mutations

class Query(graphene.ObjectType):
    greeting2 = graphene.String()
    def resolve_greeting2(self, info, **kwargs):
        return "Hello World!"

    

class Mutation(graphene.ObjectType):
    feature_send_message = mutations.FeatureSendMessage.Field()

