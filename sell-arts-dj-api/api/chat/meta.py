feature_initiate_payment ="""
# Mutation `featureInitiatePayment`

Cette mutation permet d'initier un paiement en fournissant les détails de l'utilisateur et du paiement.
    **Paramètres :**
    - `email` (String) : Adresse e-mail de l'utilisateur.
    - `name` (String) : Nom complet de l'utilisateur.
    - `address` (String) : Adresse de l'utilisateur.
    - `city` (String) : Ville de résidence de l'utilisateur.
    - `state` (String) : État ou région de résidence.
    - `postalCode` (String) : Code postal.
    - `phoneNumber` (String) : Numéro de Téléphone.
    - `order` (ID) : Identifiant de la commande.

    **Retourne :**
    - `success` (Boolean) : Succès de l'opération.
    - `message` (String) : Message de retour.
    - `payment_link` (String) : Lien de paiement généré.
    
## **Syntaxe**
```graphql
mutation (
  $email: String!,
  $name: String!,
  $address: String!,
  $city: String!,
  $state: String!,
  $postalCode: String!,
  $phoneNumber: String!,
  $order: ID!,
) {
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
```

**Exemple de mutation :**
```graphql
mutation {
    featureInitiatePayment(
    email: "sheena70@example.com"
    name: "Robert Davis"
    address: "91899 Deborah Mountain"
    city: "Erikashire"
    state: "Washington"
    postalCode: "28010"
    phoneNumber: "0505050505"
    order: 1
    ) {
    success
    message
    paymentLink
    }
}
```
"""
