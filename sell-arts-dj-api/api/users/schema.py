import graphene
from query_optimizer.fields import DjangoConnectionField
from . import mutations as mutations
from . import queries as queries
from . import types as types


class Query(graphene.ObjectType):
    users = DjangoConnectionField(types.UsersType)
    artist_profiles = DjangoConnectionField(types.ArtistProfilesType)







class Mutation(graphene.ObjectType):
    feature_update_users_deletion = mutations.FeatureUpdateUsersDeletions.Field()
    feature_update_users_activation = mutations.FeatureUpdateUsersActivation.Field()
    feature_update_user_country = mutations.FeatureUpdateUserCountry.Field()


