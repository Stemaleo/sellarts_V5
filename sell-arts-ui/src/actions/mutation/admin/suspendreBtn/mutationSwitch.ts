export const SUSPENDRE_BTN_USER_BY_ADMIN = `
   mutation (
  $users: [ID!]!
  $active: Boolean!
) {
  featureUpdateUsersActivation(
    users: $users
    active: $active
  ) {
    success
    message
    users {
      id
      name
      email
      isDeleted
    }
  }
}

`;