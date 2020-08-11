const deleteOrder = (orderId) => {
  if (!orderId) throw new Error("Id of order to delete must be provided.");
  return {};
};

module.exports = deleteOrder;
