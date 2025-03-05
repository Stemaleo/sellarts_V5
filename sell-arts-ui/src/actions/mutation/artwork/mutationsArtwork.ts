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
