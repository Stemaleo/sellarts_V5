export const UPDATE_METHOD_STYLE = `
mutation featureUpdateArtworkMethodAndStyle($artwork:ID! $method:ID!, $style: ID!){
    featureUpdateArtworkMethodAndStyle(artwork: $artwork method: $method, style: $style){
      success
      message
      artwork{
          id
      }
    }
  }
`;

export const UPDATE_ARTWORK_DELETIONS = `
mutation featureUpdateArtworkDeletions($artworks: [ID]!, $isDeleted: Boolean!) {
    featureUpdateArtworkDeletions(artworks: $artworks, delete: $isDeleted) {
      success
      message
      artworks {
        id
        isDeleted
      }
    }
  }
`;

export const FEATURE_ADD_ARTWORK_TO_EVENT = `
mutation featureAddArtworkToEvent($event: ID!, $artworks: [ID!]!) {
  featureAddArtworkToEvent(event: $event, artworks: $artworks) {
    success
    message
    event {
      id
    }
  }
}
`;

export const FEATURE_REMOVE_ARTWORK_FROM_EVENT = `
mutation featureRemoveArtworkFromEvent($event: ID!, $artworks: [ID!]!) {
  featureRemoveArtworkFromEvent(event: $event, artworks: $artworks) {
    success
    message
    event {
      id
    }
  }
}
`;


export const FEATURE_UPDATE_ARTWORK_STOCK = `
mutation featureUpdateArtworkStock($artwork: ID!, $stock: Int!) {
  featureUpdateArtworkStock(artwork: $artwork, stock: $stock) {
    success
    message
    artwork {
      id
    }
  }
}
`;


export const FEATURE_UPDATE_ORDER_STATUS = `
mutation featureUpdateOrderStatus(
  $order: ID!,
  $status: OrderStatus!    
) {
  featureUpdateOrderStatus(
    order: $order
    status: $status
  ) {
    success
    message
    order {
      id
      status
    }
  } 
} 
`;