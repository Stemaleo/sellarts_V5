import graphene
from anka.schema import Query as AnkaQuery, Mutation as AnkaMutation
from chat.schema import Query as ChatQuery, Mutation as ChatMutation
from users.schema import Query as UsersQuery, Mutation as UsersMutation


# Query globale
class Query(AnkaQuery, ChatQuery, UsersQuery, graphene.ObjectType):
    pass


# Mutation globale
class Mutation(AnkaMutation, ChatMutation, UsersMutation, graphene.ObjectType):
    pass


# Schema global
schema = graphene.Schema(query=Query, mutation=Mutation)
