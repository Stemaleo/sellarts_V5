export const GET_USERS_BY_ID = `
  query GET_USERS_BY_ID($id: ID) {
  users(id: $id) {
    edges {
      node {
        isActive
      }
    }
  }
}
`;


export const GET_ALL_USERS = `
query getAllUsers{
  users (isDeleted: false orderBy:"-id"){
    edges{
      node{
        id
        name
        email
        isDeleted
        isActive
        registeredAt
        artistProfile{
          artistType
          isDeleted
          isActive
        }
      }
    }
  }
}
`;
