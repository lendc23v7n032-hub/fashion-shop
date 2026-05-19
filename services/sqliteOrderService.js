const { db } = require('./db');
const { calculateTotals } = require('./orderUtils');
const { getAllProducts, getProductById } = require('./sqliteProductService');

function normalizeOrder(row) {
  if (!row) return null;
  return {
    ...row,
    items: row.items ? JSON.parse(row.items) : [],
  };
}

async function createOrder(orderData) {
  if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
    throw new Error('Giỏ hàng trống');
  }

  const products = await getAllProducts();
  const totals = await calculateTotals(orderData.items, products, orderData.discountCode);
  const now = new Date().toISOString();
  const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const itemsJson = JSON.stringify(orderData.items);
  const email = (orderData.email || '').toLowerCase().trim();

  const transaction = db.transaction(() => {
    for (const item of orderData.items) {
      const product = getProductById(item.productId);
      if (!product) {
        throw new Error(`Sản phẩm không tồn tại: ${item.productId}`);
      }

      const sold = (product.sold || 0) + (item.quantity || 0);
      db.prepare('UPDATE products SET sold = ? WHERE id = ?').run(sold, product.id);
    }

    db.prepare(
      `INSERT INTO orders (id, date, fullname, phone, address, email, paymentMethod, items, discountCode, status, subtotal, shipping, tax, discountAmount, total, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      orderId,
      now,
      orderData.fullname?.trim() || '',
      orderData.phone?.trim() || '',
      orderData.address?.trim() || '',
      email,
      orderData.paymentMethod || 'cash',
      itemsJson,
      orderData.discountCode || null,
      'processing',
      totals.subtotal,
      totals.shipping,
      totals.tax,
      totals.discountAmount,
      totals.total,
      now,
      now
    );
  });

  transaction();
  return getOrderById(orderId);
}

async function getAllOrders() {
  return db.prepare('SELECT * FROM orders').all().map(normalizeOrder);
}

async function getOrderById(orderId) {
  return normalizeOrder(db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId));
}

async function getOrdersByEmail(email) {
  if (!email) return [];
  return db.prepare('SELECT * FROM orders WHERE email = ?').all(email.toLowerCase().trim()).map(normalizeOrder);
}

async function updateOrderStatus(orderId, status) {
  const validStatuses = ['processing', 'confirmed', 'shipping', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    throw new Error('Trạng thái đơn hàng không hợp lệ');
  }

  const result = db.prepare('UPDATE orders SET status = ?, updatedAt = ? WHERE id = ?').run(status, new Date().toISOString(), orderId);
  if (result.changes === 0) {
    throw new Error('Đơn hàng không tồn tại');
  }

  return getOrderById(orderId);
}

async function cancelOrder(orderId) {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new Error('Đơn hàng không tồn tại');
  }

  if (order.status === 'delivered' || order.status === 'cancelled') {
    throw new Error('Không thể hủy đơn hàng đã giao hoặc đã hủy');
  }

  return updateOrderStatus(orderId, 'cancelled');
}

async function getOrderStats() {
  const orders = await getAllOrders();

  return {
    total: orders.length,
    processing: orders.filter(o => o.status === 'processing').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipping: orders.filter(o => o.status === 'shipping').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0),
  };
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByEmail,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
};