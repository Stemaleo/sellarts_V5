from faker import Faker
from graphene_django.utils.testing import GraphQLTestCase
from . import models as models
from django.core.management import call_command

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

    def test_feature_send_message(self):
        # models.Orders.objects.create(address="adads")
        # models.Orders.objects.get(id=1)
        fake = Faker()
        variables = {
            "sender": 1,
            "receiver": 2,
            "is_sender_admin": fake.boolean(),
            "content": fake.english_text(20),
        }

        response = self.query(
            """
mutation ($sender: ID!, $receiver: ID! $isSenderAdmin: Boolean!, $content: String!) {
  featureInitiatePayment(
    sender: $sender
    receiver: $receiver
    isSenderAdmin: $isSenderAdmin
    content: $content
  ) {
    success
    message
    messages{
        
    }
  }
}
            """,
        variables=variables
        )
       
        self.assertEqual(response.status_code, 200)
        self.assertResponseNoErrors(response)
        content = response.json()
        self.assertTrue(content["data"]["featureInitiatePayment"]["success"])
        self.assertEqual(content["data"]["featureInitiatePayment"]['message'], 'Success')
        # self.assertn(content["data"]["featureInitiatePayment"]["initiatePayment"], 'Hello World!')

