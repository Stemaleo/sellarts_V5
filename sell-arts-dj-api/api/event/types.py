from event import models as event_models
from anka import models as anka_models
from query_optimizer import DjangoObjectType, filter
import graphene
import django_filters


# Event
class EventFilter(filter.FilterSet):
    order_by = django_filters.OrderingFilter(
        fields=(
            [
                field.name + "__id" if field.is_relation else field.name
                for field in anka_models.Events._meta.fields
            ]
        )
    )

    class Meta:
        model = anka_models.Events
        fields = {
            field.name + "__id" if field.is_relation else field.name: ["exact"]
            for field in anka_models.Events._meta.fields
        }


class EventType(DjangoObjectType):
    id = graphene.ID(source="pk", required=True)

    class Meta:
        model = anka_models.Events
        filterset_class = EventFilter
        interfaces = (graphene.relay.Node,)


# EventRegistration
class EventRegistrationFilter(filter.FilterSet):
    order_by = django_filters.OrderingFilter(
        fields=(
            [
                field.name + "__id" if field.is_relation else field.name
                for field in anka_models.Registration._meta.fields
            ]
        )
    )

    class Meta:
        model = anka_models.Registration
        fields = {
            field.name + "__id" if field.is_relation else field.name: ["exact"]
            for field in anka_models.Registration._meta.fields
        }


class EventRegistrationType(DjangoObjectType):
    id = graphene.ID(source="pk", required=True)

    class Meta:
        model = anka_models.Registration
        filterset_class = EventRegistrationFilter
        interfaces = (graphene.relay.Node,)




# EventArtwork
class EventArtworkFilter(filter.FilterSet):
    order_by = django_filters.OrderingFilter(
        fields=(
            [
                field.name + "__id" if field.is_relation else field.name
                for field in event_models.EventArtwork._meta.fields
            ]
        )
    )

    class Meta:
        model = event_models.EventArtwork
        fields = {
            field.name + "__id" if field.is_relation else field.name: ["exact"]
            for field in event_models.EventArtwork._meta.fields
        }


class EventArtworkType(DjangoObjectType):
    id = graphene.ID(source="pk", required=True)

    class Meta:
        model = event_models.EventArtwork
        filterset_class = EventArtworkFilter
        interfaces = (graphene.relay.Node,)



class EventsMediaKeysFilter(filter.FilterSet):
    order_by = django_filters.OrderingFilter(
        fields=(
            [
                field.name + "__id" if field.is_relation else field.name
                for field in anka_models.EventsMediaKeys._meta.fields
            ]
        )
    )

    class Meta:
        model = anka_models.EventsMediaKeys
        fields = {
            field.name + "__id" if field.is_relation else field.name: ["exact"]
            for field in anka_models.EventsMediaKeys._meta.fields
        }


class EventsMediaKeysType(DjangoObjectType):
    id = graphene.ID(source="pk", required=True)

    class Meta:
        model = anka_models.EventsMediaKeys
        filterset_class = EventsMediaKeysFilter
        interfaces = (graphene.relay.Node,)

class EventsMediaUrlsFilter(filter.FilterSet):
    order_by = django_filters.OrderingFilter(
        fields=(
            [
                field.name + "__id" if field.is_relation else field.name    
                for field in anka_models.EventsMediaUrls._meta.fields
            ]
        )
    )   

    class Meta:
        model = anka_models.EventsMediaUrls
        fields = {
            field.name + "__id" if field.is_relation else field.name: ["exact"]
            for field in anka_models.EventsMediaUrls._meta.fields
        }



class EventsMediaUrlsType(DjangoObjectType):
    id = graphene.ID(source="pk", required=True)

    class Meta:
        model = anka_models.EventsMediaUrls
        filterset_class = EventsMediaUrlsFilter
        interfaces = (graphene.relay.Node,)

