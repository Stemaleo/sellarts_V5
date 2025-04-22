FeatureAddArtworkToEvent = """
# Mutation `featureAddArtworkToEvent`

This mutation allows adding artworks to an event.
    **Parameters:**
    - `event` (ID): Event identifier.
    - `artworks` (List of ID): List of artwork IDs to add to the event.


    **Returns:**            
    - `success` (Boolean): Success of the operation.
    - `message` (String): Return message.
    - `event` (EventArtwork): The updated event artwork relationship.
    
## **Syntax**
```graphql
mutation (
  $event: ID!,
  $artworks: [ID!]!,
) {
  featureAddArtworkToEvent(
    event: $event
    artworks: $artworks
  ) {
    success         
    message
    event {
      id
      artwork {
        id
      } 
    }
  }
}
```

## **Example**      
```graphql
mutation {
  featureAddArtworkToEvent(event: "1", artworks: ["2", "3"], addedBy: "4") {
    success
    message
    event {
      id
      artwork {
        id
      }
    }
  }
}   
```             
"""

FeatureRemoveArtworkFromEvent = """
# Mutation `featureRemoveArtworkFromEvent`

This mutation allows removing artworks from an event.
    **Parameters:**
    - `event` (ID): Event identifier.
    - `artworks` (List of ID): List of artwork IDs to remove from the event.

    **Returns:**
    - `success` (Boolean): Success of the operation.
    - `message` (String): Return message.
    - `event` (EventArtwork): The updated event artwork relationship.
    
## **Syntax**
```graphql
mutation (
  $event: ID!,
  $artworks: [ID!]!
) {
  featureRemoveArtworkFromEvent(
    event: $event
    artworks: $artworks
  ) {
    success
    message 
    event {
      id
      artwork {
        id
      }
    }
  }
}   
```

## **Example**
```graphql  
mutation {
  featureRemoveArtworkFromEvent(event: "1", artworks: ["2", "3"]) {
    success
    message
    event {         
      id
      artwork {
        id
      }
    }
  }
}   
```
"""
