const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { validateCheckout } = require('../middleware/validator');
const { requireAdmin, requireAuth } = require('../middleware/auth');
const { checkoutLimiter } = require('../middleware/security');
const {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByEmail,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
} = require('../services/orderService');

router.get('/stats', requireAdmin, asyncHandler(async (req, res) => {
  res.json(await getOrderStats());
}));

router.get('/', requireAdmin, asyncHandler(async (req, res) => {
  res.json(await getAllOrders());
}));

router.get('/my', requireAuth, asyncHandler(async (req, res) => {
  const orders = await getOrdersByEmail(req.user.email);
  res.json(orders);
}));

router.get('/:id', requireAuth, asyncHandler(async (req, res) => {
  const order = await getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Đơn hàng không tồn tại' });
  }

  if (req.user.role !== 'admin' && order.email !== req.user.email) {
    return res.status(403).json({ success: false, error: 'Không có quyền xem đơn hàng này' });
  }

  res.json(order);
}));

router.post('/checkout', checkoutLimiter, validateCheckout, asyncHandler(async (req, res) => {
  const order = await createOrder(req.body);
  res.status(201).json(order);
}));

router.put('/:id/status', requireAdmin, asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ success: false, error: 'Trạng thái đơn hàng là bắt buộc' });
  }
  const order = await updateOrderStatus(req.params.id, status);
  res.json(order);
}));

router.post('/:id/cancel', requireAdmin, asyncHandler(async (req, res) => {
  const order = await cancelOrder(req.params.id);
  res.json(order);
}));

module.exports = router;
