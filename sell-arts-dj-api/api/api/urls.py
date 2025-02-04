from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from anka.views import instant_payment_notification
from . import env as env


urlpatterns = [
    path('sellarts/', csrf_exempt(GraphQLView.as_view(graphiql=env.ENV['GRAPHIQL_MODE']))),
    path('ipn/', instant_payment_notification, name='ipn')
]


