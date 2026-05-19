const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { validateDiscount } = require('../middleware/validator');
const { requireAdmin } = require('../middleware/auth');
const {
  getAllDiscounts,
  getDiscountByCode,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} = require('../services/discountService');

router.get('/', asyncHandler(async (req, res) => {
  res.json(await getAllDiscounts());
}));

router.get('/:code', asyncHandler(async (req, res) => {
  const discount = await getDiscountByCode(req.params.code);
  if (!discount) {
    return res.status(404).json({ success: false, error: 'Mã giảm giá không tồn tại' });
  }
  res.json(discount);
}));

router.post('/', requireAdmin, validateDiscount, asyncHandler(async (req, res) => {
  const discount = await createDiscount(req.body);
  res.status(201).json(discount);
}));

router.put('/:code', requireAdmin, validateDiscount, asyncHandler(async (req, res) => {
  const discount = await updateDiscount(req.params.code, req.body);
  res.json(discount);
}));

router.delete('/:code', requireAdmin, asyncHandler(async (req, res) => {
  await deleteDiscount(req.params.code);
  res.json({ success: true, message: 'Mã giảm giá đã được xóa' });
}));

module.exports = router;
