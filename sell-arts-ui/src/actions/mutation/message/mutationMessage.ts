export const SEND_MESSAGE_TICKET = `
  mutation (
    $ticket: ID!,
    $sender: ID!,
    $receiver: ID!,
    $isAdmin: Boolean = false,
    $content: String = ""
  ) {
    featureSendMessage(
      ticket: $ticket
      sender: $sender
      receiver: $receiver
      isAdmin: $isAdmin
      content: $content
    ) {
      success
      message
      ankaMessage {
        id
        content
        createdAt
        isAdmin
      }
    }
  }
`;

export const UPDATE_TICKET_MUTATION = `
  mutation (
    $ticketId: ID!,
    $status: String!
  ) {
    updateTicket(
      ticketId: $ticketId
      status: $status
    ) {
      success
      message
      ticket {
        id
        status
        updatedAt
      }
    }
  }
`;
