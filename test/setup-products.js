/**
 * Setup script to create test products for cart/checkout testing
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Admin credentials (from .env)
const adminEmail = process.env.ADMIN_EMAIL || 'lelenhoang3004@gmail.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'; // Default, may need to update

const testProducts = [
  {
    name: 'Áo Phông Nam Cơ Bản',
    description: 'Áo phông nam cơ bản, thoải mái và bền',
    price: 150000,
    image: 'https://via.placeholder.com/300x400?text=T-Shirt',
    stock: 50,
    category: 'Áo',
  },
  {
    name: 'Quần Jean Nam Xanh',
    description: 'Quần jean nam màu xanh đậm, chất lượng cao',
    price: 450000,
    image: 'https://via.placeholder.com/300x400?text=Jeans',
    stock: 30,
    category: 'Quần',
  },
  {
    name: 'Giày Sneaker Trắng',
    description: 'Giày sneaker trắng sạch, phù hợp với nhiều trang phục',
    price: 850000,
    image: 'https://via.placeholder.com/300x400?text=Sneaker',
    stock: 25,
    category: 'Giày',
  },
  {
    name: 'Áo Khoác Dù Chống Nước',
    description: 'Áo khoác dù chống nước, thích hợp cho mọi mùa',
    price: 650000,
    image: 'https://via.placeholder.com/300x400?text=Jacket',
    stock: 20,
    category: 'Áo Khoác',
  },
  {
    name: 'Mũ Lưỡi Trai Đen',
    description: 'Mũ lưỡi trai đen, dễ dàng phối hợp với các trang phục',
    price: 180000,
    image: 'https://via.placeholder.com/300x400?text=Cap',
    stock: 40,
    category: 'Phụ Kiện',
  },
];

const api = axios.create({
  baseURL: API_URL,
  validateStatus: () => true,
});

const log = (message, data = '') => {
  console.log(`✓ ${message}`);
  if (data) {
    console.log(`  ${typeof data === 'string' ? data : JSON.stringify(data, null, 2)}`);
  }
};

const error = (message, data = '') => {
  console.error(`✗ ${message}`);
  if (data) {
    console.error(`  ${typeof data === 'string' ? data : JSON.stringify(data, null, 2)}`);
  }
};

async function setupProducts() {
  console.log('\n=== SETTING UP TEST PRODUCTS ===\n');

  try {
    // Step 1: Check if admin user needs to register
    log('Checking admin user...');

    // For testing, we'll create products using admin routes
    // First, let's try to register an admin user if not exists
    const adminUser = {
      name: 'Admin User',
      email: adminEmail,
      password: adminPassword,
    };

    // Try to register admin (may fail if already exists, which is OK)
    let res = await api.post('/auth/register', adminUser);
    if (res.status === 201) {
      log('Admin user created', res.data.user.email);
    } else if (res.status === 400 && res.data.message.includes('Email đã được đăng ký')) {
      log('Admin user already exists, proceeding to login');
    } else {
      error('Failed to setup admin user', res.data);
      return;
    }

    // Step 2: Login as admin
    log('Logging in as admin...');
    res = await api.post('/auth/login', {
      email: adminEmail,
      password: adminPassword,
    });
    if (res.status !== 200) {
      error('Admin login failed', res.data);
      return;
    }
    const adminToken = res.data.token;
    api.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
    log('Admin login successful');

    // Step 3: Check existing products
    log('Checking existing products...');
    res = await api.get('/products');
    const existingProducts = res.data.products || [];
    log(`Found ${existingProducts.length} existing products`);

    if (existingProducts.length > 0) {
      log('Products already exist, skipping creation');
      log('Existing products:', existingProducts.map(p => `${p.name} (${p.stock} in stock)`).join(', '));
      return;
    }

    // Step 4: Create test products
    log('Creating test products...');
    for (const product of testProducts) {
      res = await api.post('/products', product);
      if (res.status === 201) {
        log(`Created: ${product.name}`, `ID: ${res.data.product._id}`);
      } else {
        error(`Failed to create: ${product.name}`, res.data);
      }
    }

    // Step 5: Verify products were created
    log('Verifying products...');
    res = await api.get('/products');
    const allProducts = res.data.products || [];
    log(`Total products: ${allProducts.length}`, allProducts.map(p => `${p.name} (${p.stock} in stock)`).join('\n  '));

    console.log('\n=== SETUP COMPLETE ===\n');

  } catch (err) {
    error('Setup failed', err.message);
    console.error(err);
  }
}

setupProducts();
