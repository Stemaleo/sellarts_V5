export const GET_ALL_STYLES = `
query GET_ALL_STYLES {
  styles(isDeleted: false) {
    edges {
      node {
        id
        name
      }
    }
  }
}

`;