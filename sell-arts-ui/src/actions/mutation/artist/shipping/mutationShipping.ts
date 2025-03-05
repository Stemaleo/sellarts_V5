export const FEATEUR_GENERATE_FEES = `
mutation featureGenerateFees($order: ID! $country:ID!) {
    featureGenerateFees(order: $order country: $country) {
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