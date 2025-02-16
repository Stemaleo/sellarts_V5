feature_update_users_deletions = """
# Mutation `featureUpdateUsersDeletions`

This mutation allows deleting or restoring multiple users by updating their `is_deleted` field.

## **Parameters:**  
- `users` (List of ID) : A list of user IDs to delete or restore.  
- `delete` (Boolean) : Set to `true` to delete users, or `false` to restore them.

## **Returns:**  
- `success` (Boolean) : Indicates whether the operation was successful.  
- `message` (String) : Response message indicating success or failure.  
- `users` (List of User) : The list of updated user objects.  

---

## **Syntax**
```graphql
mutation (
  $users: [ID!]!
  $delete: Boolean!
) {
  featureUpdateUsersDeletions(
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

mutation {
  featureUpdateUsersDeletions(
    users: [2000, 2001]
    delete: false
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
```
"""

feature_update_users_activation = """
# Mutation `featureUpdateUsersActivation`

This mutation allows activating or deactivating multiple users by updating their `is_active` field.

## **Parameters:**  
- `users` (List of ID) : A list of user IDs to update.  
- `active` (Boolean) : Set to `true` to activate the users, or `false` to deactivate them.

## **Returns:**  
- `success` (Boolean) : Indicates whether the users were successfully updated.  
- `message` (String) : Response message indicating success or failure.  
- `users` (List of User) : The list of updated user objects.  

---

## **Syntax**
```graphql
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
      isActive
    }
  }
}

mutation {
  featureUpdateUsersActivation(
    users: [2000, 2001]
    active: false
  ) {
    success
    message
    users {
      id
      name
      email
      isActive
    }
  }
}
```
"""