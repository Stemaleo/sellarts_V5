import graphene
from . import mutations as mutations
from . import types as types
from query_optimizer.fields import DjangoConnectionField

class Query(graphene.ObjectType):

    events = DjangoConnectionField(types.EventType)
    event_registration = DjangoConnectionField(types.EventRegistrationType)
    event_artwork = DjangoConnectionField(types.EventArtworkType)
    events_media_keys = DjangoConnectionField(types.EventsMediaKeysType)
    events_media_urls = DjangoConnectionField(types.EventsMediaUrlsType)

class Mutation(graphene.ObjectType):

    feature_add_artwork_to_event = mutations.FeatureAddArtworkToEvent.Field()
    feature_remove_artwork_from_event = mutations.FeatureRemoveArtworkFromEvent.Field()

