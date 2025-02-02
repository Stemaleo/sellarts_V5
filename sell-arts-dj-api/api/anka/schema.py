import graphene
from . import mutations as mutations

class Query(graphene.ObjectType):
    greeting = graphene.String()
    def resolve_greeting(self, info, **kwargs):
        return "Hello World!"



class Greeting(graphene.Mutation):
    text = graphene.String()
    class Arguments:
        text = graphene.String()
    
    @classmethod
    def mutate(cls, root, info, **kwargs):
        return Greeting(text=kwargs['text'])

class Mutation(graphene.ObjectType):
    greeting = Greeting.Field()
    feature_initiate_payment = mutations.FeatureInitiatePayment.Field()

