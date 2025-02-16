from faker import Faker
from graphene_django.utils.testing import GraphQLTestCase
from . import models as models


class SetupTests(GraphQLTestCase):
    GRAPHQL_URL = "/sellarts/"
 
    def test_query_setup(self):
        response = self.query(
            """
query {
  greeting
}
            """,
        )
        self.assertEqual(response.status_code, 200)
        self.assertResponseNoErrors(response)
        content = response.json()
        self.assertEqual(content["data"]["greeting"], 'Hello World!')
    
    def test_mutation_setup(self):
        response = self.query(
            """
mutation{
  greeting(text: "Hello World!"){
    text
  }
}
            """,
        )
        self.assertEqual(response.status_code, 200)
        self.assertResponseNoErrors(response)
        content = response.json()
        self.assertEqual(content["data"]["greeting"]["text"], 'Hello World!')       
        

        



class MutationTests(GraphQLTestCase):
    GRAPHQL_URL = "/sellarts/" 

    def test_feature_initiate_payment(self):
      # models.Orders.objects.create(address="adads")
      # models.Orders.objects.get(id=1)
      fake = Faker()
      variables = {
          "email": fake.email(),
          "name": fake.name(),
          "address": fake.street_address(),
          "city": fake.city(),
          "state": fake.state(),
          "postalCode": fake.zipcode(),
          "phoneNumber": fake.phone_number(),
          "order": 1,  #TODO Remplace avec un ID produit valide
      }

      response = self.query(
            """
mutation ($email: String!, $name: String!, $address: String!, $city: String!, $state: String!, $postalCode: String!, $order: ID! $phoneNumber: String!) {
  featureInitiatePayment(
    email: $email
    name: $name
    address: $address
    city: $city
    state: $state
    postalCode: $postalCode
    phoneNumber: $phoneNumber
    order: $order
  ) {
    success
    message
    paymentLink
  }
}
            """,
      variables=variables,

        )
       
      self.assertEqual(response.status_code, 200)
      self.assertResponseNoErrors(response)
      content = response.json()
      self.assertTrue(content["data"]["featureInitiatePayment"]["success"])
      self.assertEqual(content["data"]["featureInitiatePayment"]['message'], 'Success')
      # self.assertn(content["data"]["featureInitiatePayment"]["initiatePayment"], 'Hello World!')

