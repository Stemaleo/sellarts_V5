
export const EDIT_STYLE = `
mutation UPDATE_STYLE($id: ID!, $name: String!) {
  featureUpdateStyle(id: $id, name: $name) {
    success
    message
    style {
      id
      name
    }
  }
}
`;
