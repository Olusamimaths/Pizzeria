const AWSXRay = require("aws-xray-sdk-core");
const AWS = AWSXRay.captureAWS(require("aws-sdk"));
const rp = require("minimal-request-promise");
const docClient = new AWS.DynamoDB.DocumentClient();

const createOrder = (order) => {
  console.log("Save an order", order);
  if (!order || !order.pizza || !order.address)
    throw new Error("The order must have an id and a customer address.");

  // make the delivery request before saving the order
  return (
    rp
      .post("https://some-like-it-hot.effortless-serverless.com/delivery", {
        headers: {
          Authorization: "just-some-pizzzeria-api-344454",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          pickupTime: "12: 21pm",
          pickupAddress: "Some Pizzeria",
          deliveryAddress: order.address,
          webhookUrl:
            "https://urdq9bteqa.execute-api.eu-central-1.amazonaws.com/latest/delivery",
        }),
      })
      .then((rawResponse) => JSON.parse(rawResponse.body))
      // save the order now
      .then((response) => {
        return docClient
          .put({
            TableName: "pizza-orders",
            Item: {
              orderId: response.deliveryId, // deliveryId is unique and can be used as id of order
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
      })
  );
};

module.exports = createOrder;
