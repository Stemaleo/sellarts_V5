from . import models as models
from query_optimizer import DjangoObjectType, filter
import graphene
import django_filters


# Users
class UsersFilter(filter.FilterSet):
    order_by = django_filters.OrderingFilter(
        fields=(
            [
                field.name + "__id" if field.is_relation else field.name
                for field in models.Users._meta.fields
            ]
        )
    )

    class Meta:
        model = models.Users
        fields = {
            field.name + "__id" if field.is_relation else field.name: ["exact"]
            for field in models.Users._meta.fields
        }
        fields['registered_at'] = ["exact", "isnull"]


class UsersType(DjangoObjectType):
    id = graphene.ID(source="pk", required=True)

    class Meta:
        model = models.Users
        filterset_class = UsersFilter
        interfaces = (graphene.relay.Node,)



# TODO: Others Type

