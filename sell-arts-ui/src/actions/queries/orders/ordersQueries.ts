export const SHIPPING_QUERY = `
  query Shipping($order: ID!) {
    shipping(order_Id: $order) {
      edges {
        node {
          id
          label
          labelPdf
          invoicePdf
          user {
            name
          }
        }
      }
    }
  }
`;