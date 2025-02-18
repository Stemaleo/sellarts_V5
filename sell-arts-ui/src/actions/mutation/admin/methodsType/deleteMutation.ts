
export const DELETE_METHOD = `
mutation featureUpdateMethodDeletions($methods: [ID!]!, $detete: Boolean!) {
  featureUpdateMethodDeletions(methods: $methods, delete: $detete) {
    success
    message
    methods {
      id
      name
    }
  }
}
`;
