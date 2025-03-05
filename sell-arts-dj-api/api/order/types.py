from anka import models as anka_models
from order import models as order_models
from query_optimizer import DjangoObjectType, filter
import graphene
import django_filters



# Orders
class OrdersFilter(filter.FilterSet):
    order_by = django_filters.OrderingFilter(
        fields=(
            [
                field.name + "__id" if field.is_relation else field.name
                for field in anka_models.Orders._meta.fields
            ]
        )
    )

    class Meta:
        model = anka_models.Orders
        fields = {
            field.name + "__id" if field.is_relation else field.name: ["exact"]
            for field in anka_models.Orders._meta.fields
        }


class OrdersType(DjangoObjectType):
    id = graphene.ID(source="pk", required=True)

    class Meta:
        model = anka_models.Orders
        filterset_class = OrdersFilter
        interfaces = (graphene.relay.Node,)




# OrderItem
class OrderItemFilter(filter.FilterSet):
    order_by = django_filters.OrderingFilter(
        fields=(
            [
                field.name + "__id" if field.is_relation else field.name
                for field in anka_models.OrderItem._meta.fields
            ]
        )
    )

    class Meta:
        model = anka_models.OrderItem
        fields = {
            field.name + "__id" if field.is_relation else field.name: ["exact"]
            for field in anka_models.OrderItem._meta.fields
        }


class OrderItemType(DjangoObjectType):
    id = graphene.ID(source="pk", required=True)

    class Meta:
        model = anka_models.OrderItem
        filterset_class = OrderItemFilter
        interfaces = (graphene.relay.Node,)
        
        
# Country
class CountryFilter(filter.FilterSet):
    order_by = django_filters.OrderingFilter(
        fields=(
            [
                field.name + "__id" if field.is_relation else field.name
                for field in order_models.Country._meta.fields
            ]
        )
    )

    class Meta:
        model = order_models.Country
        fields = {
            field.name + "__id" if field.is_relation else field.name: ["exact", "in"]
            for field in order_models.Country._meta.fields
        }
        exclude = ['shipping_rates']

class CountryType(DjangoObjectType):
    id = graphene.ID(source="pk", required=True)

    class Meta:
        model = order_models.Country
        filterset_class = CountryFilter
        interfaces = (graphene.relay.Node,)


# Shipping
class ShippingFilter(filter.FilterSet):
    order_by = django_filters.OrderingFilter(
        fields=(
            [
                field.name + "__id" if field.is_relation else field.name
                for field in order_models.Shipping._meta.fields
            ]
        )
    )

    class Meta:
        model = order_models.Shipping
        fields = {
            field.name + "__id" if field.is_relation else field.name: ["exact", "in"]
            for field in order_models.Shipping._meta.fields
        }


class ShippingType(DjangoObjectType):
    id = graphene.ID(source="pk", required=True)

    class Meta:
        model = order_models.Shipping
        filterset_class = ShippingFilter
        interfaces = (graphene.relay.Node,)
