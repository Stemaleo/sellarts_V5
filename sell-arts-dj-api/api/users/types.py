from anka import models as anka_models
from query_optimizer import DjangoObjectType, filter
import graphene
import django_filters


# Users
class UsersFilter(filter.FilterSet):
    order_by = django_filters.OrderingFilter(
        fields=(
            [
                field.name + "__id" if field.is_relation else field.name
                for field in anka_models.Users._meta.fields
            ]
        )
    )

    class Meta:
        model = anka_models.Users
        fields = {
            field.name + "__id" if field.is_relation else field.name: ["exact"]
            for field in anka_models.Users._meta.fields
        }
        fields['registered_at'] = ["exact", "isnull"]
        fields['email'] = ["exact", "isnull"]


class UsersType(DjangoObjectType):
    id = graphene.ID(source="pk", required=True)

    class Meta:
        model = anka_models.Users
        filterset_class = UsersFilter
        interfaces = (graphene.relay.Node,)




# ArtistProfiles
class ArtistProfilesFilter(filter.FilterSet):
    order_by = django_filters.OrderingFilter(
        fields=(
            [
                field.name + "__id" if field.is_relation else field.name
                for field in anka_models.ArtistProfiles._meta.fields
            ]
        )
    )

    class Meta:
        model = anka_models.ArtistProfiles
        fields = {
            field.name + "__id" if field.is_relation else field.name: ["exact"]
            for field in anka_models.ArtistProfiles._meta.fields
        }
 


class ArtistProfilesType(DjangoObjectType):
    id = graphene.ID(source="pk", required=True)

    class Meta:
        model = anka_models.ArtistProfiles
        filterset_class = ArtistProfilesFilter
        interfaces = (graphene.relay.Node,)

