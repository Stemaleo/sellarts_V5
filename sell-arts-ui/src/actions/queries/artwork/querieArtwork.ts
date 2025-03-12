export const GET_ARTWORK_BY_ID = `
query GetAtworkById($id: ID!){
    artworks(id: $id){
      edges{
        node{
          method{
            id
            name
          }
          style{
            id
            name
          }
        }
      }
    }
  }
`;




