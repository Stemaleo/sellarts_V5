export const INITIATE_PAYMENT_MUTATION = `
  mutation InitiatePayment(
    $email: String!,
    $name: String!,
    $address: String!,
    $city: String!,
    $state: String!,
    $postalCode: String!,
    $phone:String!
    $order: ID!,
  ) { 
    featureInitiatePayment(
        email: $email
        name: $name
        address: $address
        city: $city
        state: $state
        postalCode: $postalCode
      	phoneNumber: $phone
        order: $order
    ) {
        success
        message
        paymentLink
    }
  }
`;