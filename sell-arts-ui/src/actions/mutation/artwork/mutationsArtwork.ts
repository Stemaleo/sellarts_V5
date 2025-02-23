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
