export const GET_MESSAGES_BY_TICKET = `
  query GetMessagesByTicket($ticket_Id: ID!) {
    messages(ticket_Id: $ticket_Id, isDeleted:false) {
      edges {
        node {
          id
          content
          createdAt
          isAdmin
          sender {
            id
            name
            email
          }
          receiver {
            id
            name
            email
          }
        }
      }
    }
}
`;


export const GET_ALL_TICKETS = `
  query GetAllTickets{
    tickets{ 
      edges{
        node{
          id
          description
          status
          title
          createdAt
          user{
            id
            email
            name
          }
        }
      }
    }
  }
`;

