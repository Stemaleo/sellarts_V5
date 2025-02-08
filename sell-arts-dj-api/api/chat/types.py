from . import models as models
from anka import models as anka_models
from query_optimizer import DjangoObjectType, filter
import graphene
import django_filters


# Ticket
class TicketFilter(filter.FilterSet):
    order_by = django_filters.OrderingFilter(
        fields=(
            [
                field.name + "__id" if field.is_relation else field.name
                for field in anka_models.Tickets._meta.fields
            ]
        )
    )

    class Meta:
        model = anka_models.Tickets
        fields = {
            field.name + "__id" if field.is_relation else field.name: ["exact"]
            for field in anka_models.Tickets._meta.fields
        }


class TicketsType(DjangoObjectType):
    id = graphene.ID(source="pk", required=True)

    class Meta:
        model = anka_models.Tickets
        filterset_class = TicketFilter
        interfaces = (graphene.relay.Node,)





## Messages
class MessagesFilter(filter.FilterSet):
    order_by = django_filters.OrderingFilter(
        fields=(
            [
                field.name + "__id" if field.is_relation else field.name
                for field in models.Messages._meta.fields
            ]
        )
    )

    class Meta:
        model = models.Messages
        fields = {
            field.name + "__id" if field.is_relation else field.name: ["exact"]
            for field in models.Messages._meta.fields
        }
        


class MessagesType(DjangoObjectType):
    id = graphene.ID(source="pk", required=True)

    class Meta:
        model = models.Messages
        filterset_class = MessagesFilter
        interfaces = (graphene.relay.Node,)


