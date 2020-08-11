const updateOrder = (orderId, updatedOrder) => {
  if (!orderId) throw new Error("Order id must be provided.");
  if (!updateOrder) throw new Error("An updated order must be provided.");
  return {
    message: `Order with id ${orderId} has been updated successfully.`,
  };
};

module.exports = updateOrder;
