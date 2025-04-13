export const FEATURE_GENERATE_FEES = `
mutation featureGenerateFees(
  $order: ID!
  $country: String!
  $state: String
  $city: String!
  $zip: String!
  $streetLine1: String!
  $streetLine2: String
  $email: String!
  $fullname: String!
  $phoneNumber: String!
) {
  featureGenerateFees(
    order: $order
    address: {
      country: $country
      state: $state
      city: $city
      zip: $zip
      streetLine1: $streetLine1
      streetLine2: $streetLine2
    }
    contact: {
      email: $email
      fullname: $fullname
      phoneNumber: $phoneNumber
    }
  ) {
    success
    message
    order {
      id
      shippingFees
      totalAmount
      amount
      size
    }
  }
} 
`