feature_send_message ="""
# Mutation `featureSendMessage`

This mutation allows sending a message within a specific ticket by providing sender, receiver, and message details.  

## **Parameters:**  
- `ticket` (ID) : The ID of the ticket where the message is sent.  
- `sender` (ID) : The ID of the user sending the message.  
- `receiver` (ID) : The ID of the user receiving the message.  
- `isAdmin` (Boolean) : Specifies whether the message is from an administrator (default: `false`).  
- `content` (String) : The content of the message (default: `""`).  

## **Returns:**  
- `success` (Boolean) : Indicates whether the message was sent successfully.  
- `message` (String) : Response message in case of success or error.  
- `ankaMessage` (Message) : The created message object.  

---

## **Syntax**
```graphql
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
    isAdminMessage: $isAdminMessage
    content: $content
  ) {
    success
    message
    ankaMessage {
      id
      content
      createdAt
    }
  }
}


mutation {
  featureSendMessage(
    ticket: "1"
    sender: "101"
    receiver: "202"
    isAdmin: true
    message: "Hello, how can I help you?"
  ) {
    success
    message
    ankaMessage {
      id
      content
      createdAt
    }
  }
}



```
"""
