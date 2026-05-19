const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { validateProduct } = require('../middleware/validator');
const { requireAdmin } = require('../middleware/auth');
const {
  getAllProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
} = require('../services/productService');

router.get('/', asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  if (search || category) {
    const products = await searchProducts(search || '', category || '');
    return res.json(products);
  }
  res.json(await getAllProducts());
}));

router.get('/stats', asyncHandler(async (req, res) => {
  res.json(await getProductStats());
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const product = await getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Sản phẩm không tồn tại' });
  }
  res.json(product);
}));

router.post('/', requireAdmin, validateProduct, asyncHandler(async (req, res) => {
  const product = await createProduct(req.body);
  res.status(201).json(product);
}));

router.put('/:id', requireAdmin, validateProduct, asyncHandler(async (req, res) => {
  const updated = await updateProduct(req.params.id, req.body);
  res.json(updated);
}));

router.delete('/:id', requireAdmin, asyncHandler(async (req, res) => {
  await deleteProduct(req.params.id);
  res.json({ success: true, message: 'Sản phẩm đã được xóa' });
}));

module.exports = router;
