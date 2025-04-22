feature_update_order_payment_and_shipping_method = """
# Mutation `featureUpdateOrderPaymentAndShippingMethod`

This mutation allows updating the payment and shipping method of an order.
    **Parameters:**
    - `order` (ID): Order identifier.
    - `paymentMethod` (String): Chosen payment method.
    - `shippingMethod` (String): Chosen shipping method.

    **Returns:**
    - `success` (Boolean): Success of the operation.
    - `message` (String): Return message.
    - `order` (Order): The updated order.
    
## **Syntax**
```graphql
mutation (
  $order: ID!,
  $isForShipping: Boolean!,
  $isForPos: Boolean!
) {
  featureUpdateOrderPaymentAndShippingMethod(
    order: $order
    isForShipping: $isForShipping
    isForPos: $isForPos
  ) {
    success
    message
    order {
      id
      isForShipping
      isForPos
    }
  }
}   
```    
## **Example**      
```graphql
mutation {
  featureUpdateOrderPaymentAndShippingMethod(order: "1", isForShipping: true, isForPos: false) {
    success
    message
    order {
      id
      isForShipping
      isForPos
    }
  }
}
```
""" 


feature_update_order_status = """
# Mutation `featureUpdateOrderStatus`

This mutation allows updating the status of an order.

## **Parameters:**
- `order` (ID): Order identifier.
- `status` (String): New status of the order.

## **Returns:**
- `success` (Boolean): Success of the operation.
- `message` (String): Return message.
- `order` (Order): The updated order. 

## **Syntax**
```graphql
mutation featureUpdateOrderStatus(
  $order: ID!,
  $status: OrderStatus!    
) {
  featureUpdateOrderStatus(
    order: $order
    status: $status
  ) {
    success
    message
    order {
      id
      status
    }
  }
} 
```
## **Example**
```graphql
mutation  {
  featureUpdateOrderStatus(order: "1", status: "WAITING_PAYMENT") {
    success
    message
    order {
      id
      status
    }
  }
}
```
"""
