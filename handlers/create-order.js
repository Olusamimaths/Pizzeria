const AWSXRay = require("aws-xray-sdk-core");
const AWS = AWSXRay.captureAWS(require("aws-sdk"));
const rp = require("minimal-request-promise");
const docClient = new AWS.DynamoDB.DocumentClient();

const createOrder = (request) => {
  console.log("Save an order", request.body);
  // get the user data from the request context object
  const userData = request.context.authorizer.claims;
  console.log("User data", userData);

  //by default yse the address from the request
  let userAddress = request.body && request.body.address;
  // if the user address is not supplied use the default address
  if (!userAddress) userAddress = JSON.parse(userAddress.address).formatted;

  if (!request.body || !request.body.pizza || !request.body.address)
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
          deliveryAddress: userAddress,
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
              pizza: request.body.pizza,
              address: userAddress,
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
