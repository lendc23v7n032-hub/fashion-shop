const sqliteProductService = require('./sqliteProductService');

async function initializeProducts() {
  return sqliteProductService.initializeProducts();
}

async function getAllProducts() {
  return sqliteProductService.getAllProducts();
}

async function getProductById(productId) {
  return sqliteProductService.getProductById(productId);
}

async function getProductsByCategory(category) {
  return sqliteProductService.getProductsByCategory(category);
}

async function searchProducts(searchTerm, category = '') {
  return sqliteProductService.searchProducts(searchTerm, category);
}

async function createProduct(productData) {
  return sqliteProductService.createProduct(productData);
}

async function updateProduct(productId, updates) {
  return sqliteProductService.updateProduct(productId, updates);
}

async function deleteProduct(productId) {
  return sqliteProductService.deleteProduct(productId);
}

async function getProductStats() {
  return sqliteProductService.getProductStats();
}

async function validateProductsExist(productIds) {
  return sqliteProductService.validateProductsExist(productIds);
}

module.exports = {
  initializeProducts,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
  validateProductsExist,
};
