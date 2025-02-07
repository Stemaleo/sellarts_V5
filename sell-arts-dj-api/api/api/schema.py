import graphene
from anka.schema import Query as AnkaQuery, Mutation as AnkaMutation
from chat.schema import Query as ChatQuery, Mutation as ChatMutation

# Query globale
class Query(AnkaQuery, ChatQuery, graphene.ObjectType):
    pass

# Mutation globale
class Mutation(AnkaMutation, ChatMutation, graphene.ObjectType):
    pass

# Schema global
schema = graphene.Schema(query=Query, mutation=Mutation)