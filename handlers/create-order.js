const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require("uuid");

const createOrder = (order) => {
  if (!order || !order.pizza || !order.address)
    throw new Error("The order must have an id and a customer address.");
  return docClient
    .put({
      TableName: "pizza-orders",
      Item: {
        orderId: uuidv4(),
        pizza: order.pizza,
        address: order.address,
        orderStatus: "pending",
      },
    })
    .promise()
    .then((res) => {
      console.log("Order saved. ", res);
      return res;
    })
    .catch((error) => {
      console.log(`Error: order could not be saved,`, error);
      throw error;
    });
};

module.exports = createOrder;
