const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const deleteOrder = (orderId) => {
  if (!orderId) throw new Error("Id of order to delete must be provided.");
  return docClient
    .delete({
      TableName: "pizza-orders",
      Key: {
        orderId,
      },
    })
    .promise()
    .then((result) => {
      console.log("Successfully deleted order ", result);
      return result;
    })
    .catch((error) => {
      console.log("Error: could not delete order ", error);
      throw error;
    });
};

module.exports = deleteOrder;
