import graphene
from anka.schema import Query as AnkaQuery, Mutation as AnkaMutation

# Query globale
class Query(AnkaQuery, graphene.ObjectType):
    pass

# Mutation globale
class Mutation(AnkaMutation, graphene.ObjectType):
    pass

# Schema global
schema = graphene.Schema(query=Query, mutation=Mutation)