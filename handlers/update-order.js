const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const updateOrder = (orderId, update) => {
  if (!orderId) throw new Error("Order id must be provided.");
  if (!update) throw new Error("An updated order must be provided.");
  return docClient
    .update({
      TableName: "pizza-orders",
      Key: {
        orderId,
      },
      UpdateExpression: "set pizza = :p, address = :a",
      ExpressionAttributeValues: {
        ":p": update.pizza,
        ":a": update.address,
      },
    })
    .promise()
    .then((result) => {
      console.log("Order is updated.", result);
      return result.Attributes;
    })
    .catch((error) => {
      console.log("Error: Could not update order. ", error);
      throw error;
    });
};

module.exports = updateOrder;
