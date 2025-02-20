export const FEATEUR_GENERATE_FEES = `
mutation featureGenerateFees($order: ID!) {
    featureGenerateFees(order: $order) {
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