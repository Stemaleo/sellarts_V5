from . import models as models
from query_optimizer import DjangoObjectType, filter
import graphene
import django_filters


# Methods
class MethodsFilter(filter.FilterSet):
    order_by = django_filters.OrderingFilter(
        fields=(
            [
                field.name + "__id" if field.is_relation else field.name
                for field in models.Methods._meta.fields
            ]
        )
    )

    class Meta:
        model = models.Methods
        fields = {
            field.name + "__id" if field.is_relation else field.name: ["exact"]
            for field in models.Methods._meta.fields
        }


class MethodsType(DjangoObjectType):
    id = graphene.ID(source="pk", required=True)

    class Meta:
        model = models.Methods
        filterset_class = MethodsFilter
        interfaces = (graphene.relay.Node,)





# Styles
class StylesFilter(filter.FilterSet):
    order_by = django_filters.OrderingFilter(
        fields=(
            [
                field.name + "__id" if field.is_relation else field.name
                for field in models.Styles._meta.fields
            ]
        )
    )

    class Meta:
        model = models.Styles
        fields = {
            field.name + "__id" if field.is_relation else field.name: ["exact"]
            for field in models.Styles._meta.fields
        }


class StylesType(DjangoObjectType):
    id = graphene.ID(source="pk", required=True)

    class Meta:
        model = models.Styles
        filterset_class = StylesFilter
        interfaces = (graphene.relay.Node,)



