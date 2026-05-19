const sqliteOrderService = require('./sqliteOrderService');
const { calculateTotals } = require('./orderUtils');

async function createOrder(orderData) {
  return sqliteOrderService.createOrder(orderData);
}

async function getAllOrders() {
  return sqliteOrderService.getAllOrders();
}

async function getOrderById(orderId) {
  return sqliteOrderService.getOrderById(orderId);
}

async function getOrdersByEmail(email) {
  return sqliteOrderService.getOrdersByEmail(email);
}

async function updateOrderStatus(orderId, status) {
  return sqliteOrderService.updateOrderStatus(orderId, status);
}

async function cancelOrder(orderId) {
  return sqliteOrderService.cancelOrder(orderId);
}

async function getOrderStats() {
  return sqliteOrderService.getOrderStats();
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByEmail,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
  calculateTotals,
};
