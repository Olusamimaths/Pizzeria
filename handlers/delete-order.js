const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const rp = require("minimal-request-promise");

const deleteOrder = (request) => {
  const { orderId } = request.pathParams;
  const userData = request.context.authorizer.claims;

  if (!orderId) throw new Error("Id of order to delete must be provided.");

  docClient
    .get({
      TableName: "pizza-orders",
      Key: {
        orderId,
      },
    })
    .promise()
    .then((result) => result.item)
    .then((item) => {
      if (item.cognitoUsername !== userData["cognito:username"])
        throw new Error("Order is not owned by the user.");

      if (item.orderStatus !== "pending")
        throw new Error(
          "You cannot change the status when the order is no more pending."
        );
      // cancel the delivery

      return (
        rp
          .delete(
            `https://some-like-it-hot.effortless-serverless.com/delivery/${orderId}`,
            {
              headers: {
                Authorization: "just-some-pizzzeria-api-344454",
                "Content-type": "application/json",
              },
            }
          )
          // delete it in the database
          .then(() => {
            return docClient
              .delete({
                TableName: "pizza-orders",
                Key: {
                  orderId,
                },
              })
              .promise();
            // both then and catch removed because
            // result will be sent directly as an API response
          })
      );
    })
    .catch((error) => {
      console.log("Error: order seems not to exist.", error);
    });
};

module.exports = deleteOrder;
