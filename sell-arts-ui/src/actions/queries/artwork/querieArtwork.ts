export const GET_ARTWORK_BY_ID = `
query GetAtworkById($id: ID!){
    artworks(id: $id){
      edges{
        node{
          method{
            id
            name
          }
          style{
            id
            name
          }
          bidSet(orderBy:"-amount"){
            amount
          }
        }
      }
    }
  }
`;




export const GET_EVENT_ARTWORK_BY_ID = `
query eventArtwork($event_Id: ID!, $isDeleted: Boolean! = false) {
  eventArtwork(event_Id: $event_Id, isDeleted: $isDeleted) {
    edges {
      node {
        id
        artwork {
          id
          title
          isFeatured
          createdAt
          description
          isFeatured
          height
          stock
          isDeleted
          size
          width
          height
          price
          owner {
            id
            name
            artistProfile {
              id
              location
            }
          }
          mediasSet {
            publicUrl
            contentSize
            contentType
            key
          }
          materialType {
            id
            name
          }
          style {
            id
            name
          }
          method {
            id
            name
          }
          artist {
            name
            artistProfile {
              id
              artistType
              bio
              coverKey
              coverUrl
              location
              isDeleted
              portfolioUrl
            }
          }
        }
      }
    }
  }
}
`;
export const GET_ARTWORK_BY_ID_EVENT = `
query GetAtworkByIdEvent($id: ID!, $event_Id: ID) {
  artworks(id: $id) {
    edges {
      node {
        eventartworkSet(event_Id: $event_Id, isDeleted: false) {
          id
        }
      }
    }
  }
}
`;

export const EVENT_REGISTRATION = `
query eventRegistration($user_Id: ID!, $event_Id: ID!) {
  eventRegistration(user_Id: $user_Id, event_Id: $event_Id) {
    edges {
      node {
        id
        event {
          owner {
            id
            artistProfile{
              id
            }
          }
        }
      }
    }
  }
}
`;
