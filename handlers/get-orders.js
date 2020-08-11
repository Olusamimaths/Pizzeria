const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const getOrders = (orderId) => {
  if (typeof orderId === "undefined")
    return docClient
      .scan({
        TableName: "pizza-orders",
      })
      .promise()
      .then((result) => result.items); // filter out only the items

  // no order id provided, get all the orders
  return docClient
    .get({
      TableName: "pizza-orders",
      Key: {
        orderId: orderId,
      },
    })
    .promise()
    .then((result) => result.item);
};

module.exports = getOrders;
