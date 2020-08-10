const pizzas = require("../data/pizzas.json");

const getPizzas = (pizzaId) => {
  if (!pizzaId) return pizzas;

  const pizza = pizzas.find((pizza) => {
    return pizza.id == pizzaId;
  });

  if (pizza) return pizza;

  throw new Error("The pizza requested is not found.");
};

module.exports = getPizzas;
