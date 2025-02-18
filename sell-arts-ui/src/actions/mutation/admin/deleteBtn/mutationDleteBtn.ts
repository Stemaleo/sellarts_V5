export const DELETE_BTN_USER_BY_ADMIN = `
    mutation (
    $users: [ID!]!
    $delete: Boolean!
    ) {
    featureUpdateUsersDeletion(
        users: $users
        delete: $delete
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