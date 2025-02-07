from . import models as models
from query_optimizer import DjangoObjectType, filter
import graphene
import django_filters


# Conversations
# class ConversationsFilter(filter.FilterSet):
#     order_by = django_filters.OrderingFilter(
#         fields=(
#             [
#                 field.name + "__id" if field.is_relation else field.name
#                 for field in models.Conversations._meta.fields
#             ]
#         )
#     )

#     class Meta:
#         model = models.Conversations
#         fields = {
#             field.name + "__id" if field.is_relation else field.name: ["exact"]
#             for field in models.Conversations._meta.fields
#         }


# class ConversationsType(DjangoObjectType):
#     id = graphene.ID(source="pk", required=True)

#     class Meta:
#         model = models.Conversations
#         filterset_class = ConversationsFilter
#         interfaces = (graphene.relay.Node,)





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


