from anka import models as anaka_models
from anka import models as anka_models
from query_optimizer import DjangoObjectType, filter
import graphene
import django_filters

## Messages
class UsersFilter(filter.FilterSet):
    order_by = django_filters.OrderingFilter(
        fields=(
            [
                field.name + "__id" if field.is_relation else field.name
                for field in anaka_models.Users._meta.fields
            ]
        )
    )

    class Meta:
        model = anaka_models.Users
        fields = {
            field.name + "__id" if field.is_relation else field.name: ["exact"]
            for field in anaka_models.Users._meta.fields
        }
        


class UsersType(DjangoObjectType):
    id = graphene.ID(source="pk", required=True)

    class Meta:
        model = anaka_models.Users
        filterset_class = UsersFilter
        interfaces = (graphene.relay.Node,)


