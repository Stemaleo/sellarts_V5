feature_create_method = """
    # Mutation `featureCreateMethod`
    
    This mutation allows creating a new method.
    
    ## **Parameters:**  
    - `name` (String) : The name of the method (Required).  
    - `owner` (ID) : The ID of the owner (Required).  
    
    ## **Returns:**  
    - `success` (Boolean) : Indicates whether the operation was successful.  
    - `message` (String) : Response message indicating success or failure.  
    - `method` (Method) : The newly created method object.  
    
    ---
    
    ## **Syntax**
    ```graphql
    mutation (
      $name: String!
      $owner: ID!
    ) {
      featureCreateMethod(
        name: $name
        owner: $owner
      ) {
        success
        message
        method {
          id
          name
          owner {
            id
            name
          }
        }
      }
    }
    
    mutation {
      featureCreateMethod(
        name: "Payment Processing"
        owner: 1001
      ) {
        success
        message
        method {
          id
          name
          owner {
            id
            name
          }
        }
      }
    }
    ```
    """
    
    
feature_update_method = """
# Mutation `featureUpdateMethod`

This mutation allows modifying an existing method by updating its `name` field.

## **Parameters:**  
- `id` (ID) : The ID of the method to be updated.  
- `name` (String) : The new name for the method.  

## **Returns:**  
- `success` (Boolean) : Indicates whether the update was successful.  
- `message` (String) : Response message indicating success or failure.  
- `method` (Method) : The updated method object.  

---

## **Syntax**
```graphql
mutation (
  $id: ID!
  $name: String!
) {
  featureUpdateMethod(
    id: $id
    name: $name
  ) {
    success
    message
    method {
      id
      name
    }
  }
}

mutation {
  featureUpdateMethod(
    id: "1234"
    name: "Updated Method Name"
  ) {
    success
    message
    method {
      id
      name
    }
  }
}
"""

feature_update_artwork_stock = """
# Mutation `featureUpdateArtworkStock`

This mutation allows updating the stock of an artwork.

## **Parameters:**  
- `artwork` (ID) : The ID of the artwork to update the stock.  
- `stock` (Int) : The new stock of the artwork.  

## **Returns:**  
- `success` (Boolean) : Indicates whether the operation was successful.  
- `message` (String) : Response message indicating success or failure.  
- `artwork` (Artwork) : The updated artwork object.  

---

## **Syntax**
```graphql
mutation featureUpdateArtworkStock(
  $artwork: ID!
  $stock: Int!
) {
  featureUpdateArtworkStock(
    artwork: $artwork
    stock: $stock
  ) {
    success
    message
    artwork { 
      id
      stock
    }
  }
}
```
## **Example**
```graphql
mutation {
  featureUpdateArtworkStock(
    artwork: "1234"
    stock: 100
  ) { 
    success
    message
    artwork {
      id
      stock
    }
  } 
}
```
"""
