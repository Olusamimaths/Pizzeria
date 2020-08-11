const Api = require("claudia-api-builder");
const api = new Api();
const getPizzas = require("./handlers/get-pizza");
const createOrder = require("./handlers/create-order");
const updateOrder = require("./handlers/update-order");
const deleteOrder = require("./handlers/delete-order");
const getOrders = require("./handlers/get-orders");

api.get("/", () => "Welcome to Pizza API");

api.get("/pizzas", () => getPizzas());

api.get(
  "/pizzas/{id}",
  (request) => {
    return getPizzas(request.pathParams.id);
  },
  { error: 404 }
);

api.get(
  "/orders/{id}",
  (request) => {
    return getOrders(request.pathParams.id);
  },
  { error: 404 }
);

api.post(
  "/orders",
  (request) => {
    return createOrder(request.body);
  },
  { success: 201, error: 404 }
);

api.put(
  "/orders/{id}",
  (request) => {
    return updateOrder(request.pathParams.id, request.body);
  },
  { error: 400 }
);

api.delete(
  "/orders/{id}",
  (request) => {
    return deleteOrder(request.pathParams.orderId);
  },
  { error: 400 }
);

module.exports = api;
