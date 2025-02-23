
  export const GET_ALL_METHODS = `
  query GET_ALL_METHODS {
    methods(isDeleted: false) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
