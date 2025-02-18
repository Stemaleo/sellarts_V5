export const CREATE_STYLE = `
mutation CREATE_STYLE($name: String!) {
  featureCreateStyle(name: $name) {
    success
    message
    style {
      id
      name
    }
  }
}
`;