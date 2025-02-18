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

