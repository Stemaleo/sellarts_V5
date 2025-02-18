
export const EDIT_METHOD = `
mutation featureUpdateMethod($id: ID!, $name: String!) {
  featureUpdateMethod(id: $id, name: $name) {
    success
    message
    method {
      id
      name
    }
  }
}
`;
