const fs = require('fs');
const path = require('path');
const { db } = require('./db');

function loadInitialProducts() {
  const dataFile = path.join(__dirname, '..', 'data', 'products.json');
  try {
    const fileContent = fs.readFileSync(dataFile, 'utf8');
    const parsed = JSON.parse(fileContent);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    // Nếu không đọc được file, dùng fallback mặc định
  }

  return [
    {
      id: '001',
      name: 'Áo Thun Basic',
      category: 'Áo',
      price: 150000,
      image: '👕',
      rating: 4.5,
      sold: 320,
      createdAt: '2024-05-20',
      description: 'Áo thun trắng basic chất lượng cao',
    },
    {
      id: '002',
      name: 'Áo Sơ Mi Nam',
      category: 'Áo',
      price: 280000,
      image: '👔',
      rating: 4.8,
      sold: 210,
      createdAt: '2024-04-15',
      description: 'Áo sơ mi nam kiểu dáng hiện đại',
    },
    {
      id: '003',
      name: 'Áo Len Nữ',
      category: 'Áo',
      price: 320000,
      image: '🧥',
      rating: 4.6,
      sold: 410,
      createdAt: '2024-06-10',
      description: 'Áo len nữ ấm áp mùa đông',
    },
  ];
}

async function initializeProducts() {
  const initialProducts = loadInitialProducts();
  const count = db.prepare('SELECT COUNT(*) AS count FROM products').get();

  const insert = db.prepare(
    `INSERT INTO products (id, name, category, price, image, rating, sold, description, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const insertMany = db.transaction((items) => {
    for (const product of items) {
      insert.run(
        product.id,
        product.name,
        product.category,
        product.price,
        product.image,
        product.rating || null,
        product.sold || 0,
        product.description || null,
        product.createdAt || new Date().toISOString(),
        product.updatedAt || null
      );
    }
  });

  if (count.count === 0) {
    insertMany(initialProducts);
    return initialProducts;
  }

  const existingIds = db.prepare('SELECT id FROM products').all().map(row => row.id);
  const missingProducts = initialProducts.filter(product => !existingIds.includes(product.id));
  if (missingProducts.length > 0) {
    insertMany(missingProducts);
  }

  return db.prepare('SELECT * FROM products').all();
}

async function getAllProducts() {
  return db.prepare('SELECT * FROM products').all();
}

async function getProductById(productId) {
  return db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
}

async function getProductsByCategory(category) {
  return db.prepare('SELECT * FROM products WHERE category = ?').all(category);
}

async function searchProducts(searchTerm, category = '') {
  const conditions = [];
  const params = [];

  if (searchTerm) {
    conditions.push('(name LIKE ? OR description LIKE ?)');
    params.push(`%${searchTerm}%`, `%${searchTerm}%`);
  }

  if (category) {
    conditions.push('category = ?');
    params.push(category);
  }

  const sql = `SELECT * FROM products${conditions.length ? ' WHERE ' + conditions.join(' AND ') : ''}`;
  return db.prepare(sql).all(...params);
}

async function createProduct(productData) {
  let { id } = productData;

  if (!id) {
    const rows = db.prepare('SELECT id FROM products').all();
    const maxId = rows.reduce((max, row) => {
      const num = parseInt(row.id, 10);
      return Number.isFinite(num) ? Math.max(max, num) : max;
    }, 0);
    id = String(maxId + 1).padStart(3, '0');
  }

  const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(id);
  if (existing) {
    throw new Error('ID sản phẩm đã tồn tại');
  }

  const product = {
    id,
    name: productData.name.trim(),
    category: productData.category.trim(),
    price: productData.price,
    image: productData.image || '📦',
    rating: productData.rating || 0,
    sold: productData.sold || 0,
    description: productData.description?.trim() || '',
    createdAt: new Date().toISOString(),
    updatedAt: null,
  };

  db.prepare(
    `INSERT INTO products (id, name, category, price, image, rating, sold, description, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    product.id,
    product.name,
    product.category,
    product.price,
    product.image,
    product.rating,
    product.sold,
    product.description,
    product.createdAt,
    product.updatedAt
  );

  return product;
}

async function updateProduct(productId, updates) {
  const current = await getProductById(productId);
  if (!current) {
    throw new Error('Sản phẩm không tồn tại');
  }

  const allowedFields = ['name', 'category', 'price', 'image', 'rating', 'description'];
  const changes = [];
  const params = [];

  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      changes.push(`${field} = ?`);
      params.push(updates[field]);
    }
  });

  if (changes.length === 0) {
    return current;
  }

  changes.push('updatedAt = ?');
  params.push(new Date().toISOString());
  params.push(productId);

  db.prepare(`UPDATE products SET ${changes.join(', ')} WHERE id = ?`).run(...params);
  return getProductById(productId);
}

async function deleteProduct(productId) {
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(productId);
  if (result.changes === 0) {
    throw new Error('Sản phẩm không tồn tại');
  }
  return true;
}

async function getProductStats() {
  const products = await getAllProducts();
  const stats = {
    total: products.length,
    totalSold: products.reduce((sum, p) => sum + (p.sold || 0), 0),
    byCategory: {},
    topProducts: [...products].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 5),
  };

  products.forEach((p) => {
    if (!stats.byCategory[p.category]) {
      stats.byCategory[p.category] = { count: 0, totalSold: 0 };
    }
    stats.byCategory[p.category].count++;
    stats.byCategory[p.category].totalSold += p.sold || 0;
  });

  return stats;
}

async function validateProductsExist(productIds) {
  if (!productIds || productIds.length === 0) {
    return true;
  }

  const placeholders = productIds.map(() => '?').join(',');
  const rows = db.prepare(`SELECT id FROM products WHERE id IN (${placeholders})`).all(...productIds);
  const foundIds = rows.map((row) => String(row.id));
  const missing = productIds.filter((id) => !foundIds.includes(String(id)));

  if (missing.length > 0) {
    throw new Error(`Sản phẩm không tồn tại: ${missing.join(', ')}`);
  }

  return true;
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