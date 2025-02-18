export const DELETE_STYLE = `
mutation featureUpdateStyleDeletions($styles: [ID!]!, $detete: Boolean!) {
  featureUpdateStyleDeletions(styles: $styles, delete: $detete) {
    success
    message
    styles {
      id
      name
    }
  }
}
`;
