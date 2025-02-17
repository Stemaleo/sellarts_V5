import graphene
from anka.schema import Query as AnkaQuery, Mutation as AnkaMutation
from chat.schema import Query as ChatQuery, Mutation as ChatMutation
from users.schema import Query as UsersQuery, Mutation as UsersMutation
from artwork.schema import Query as ArtworkQuery, Mutation as ArtworkMutation


# Query globale
class Query(AnkaQuery, ChatQuery, UsersQuery, ArtworkQuery, graphene.ObjectType):
    pass


# Mutation globale
class Mutation(AnkaMutation, ChatMutation, UsersMutation, ArtworkMutation, graphene.ObjectType):
    pass


# Schema global
schema = graphene.Schema(query=Query, mutation=Mutation)
