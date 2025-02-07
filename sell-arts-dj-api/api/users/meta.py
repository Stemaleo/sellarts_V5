feature_delete_users ="""
# Mutation `featureDeleteUsers`

This mutation allows deleting multiple users by setting their `registered_at` field to `null`.

## **Parameters:**  
- `users` (List of ID) : A list of user IDs to delete.

## **Returns:**  
- `success` (Boolean) : Indicates whether the users were successfully deleted.  
- `message` (String) : Response message indicating success or failure.  
- `users` (List of User) : The list of deleted user objects.  

---

## **Syntax**
```graphql
mutation (
  $users: [ID!]!
) {
  featureDeleteUsers(
    users: $users
  ) {
    success
    message
    users {
      id
      name
      email
      registeredAt
    }
  }
}


mutation {
  featureDeleteUsers(
    users: 2000
  ) {
    success
    message
    users {
      id
      name
      email
      registeredAt
    }
  }
}
```
"""
