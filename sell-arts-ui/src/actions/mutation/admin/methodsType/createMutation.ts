export const CREATE_METHOD = `
mutation CREATE_METHOD($name: String!) {
  featureCreateMethod(name: $name) {
    success
    message
    method {
      id
      name
    }
  }
}
`;