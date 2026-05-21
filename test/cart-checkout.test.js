/**
 * Test Script for Cart and Checkout Flow
 * Tests: Add to cart, update cart, remove from cart, checkout
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Test user data
const testUser = {
  name: 'Test User',
  email: `test-${Date.now()}@example.com`,
  password: 'testpassword123',
};

let authToken = '';
let userId = '';
let productId = '';

// Axios instance with default headers
const api = axios.create({
  baseURL: API_URL,
  validateStatus: () => true, // Don't throw on any status
});

const log = (step, message, data = '') => {
  console.log(`\n✓ [${step}] ${message}`);
  if (data) {
    console.log(`  ${typeof data === 'string' ? data : JSON.stringify(data, null, 2)}`);
  }
};

const error = (step, message, data = '') => {
  console.error(`\n✗ [${step}] ${message}`);
  if (data) {
    console.error(`  ${typeof data === 'string' ? data : JSON.stringify(data, null, 2)}`);
  }
};

async function runTests() {
  console.log('\n=== CART AND CHECKOUT FLOW TEST ===\n');

  try {
    // Step 1: Register user
    log('1', 'Registering test user...', testUser.email);
    let res = await api.post('/auth/register', testUser);
    if (res.status !== 201) {
      error('1', 'Registration failed', res.data);
      return;
    }
    authToken = res.data.token;
    userId = res.data.user.id;
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    log('1', 'User registered successfully', `ID: ${userId}`);

    // Step 2: Login user
    log('2', 'Logging in user...');
    res = await api.post('/auth/login', {
      email: testUser.email,
      password: testUser.password,
    });
    if (res.status !== 200) {
      error('2', 'Login failed', res.data);
      return;
    }
    authToken = res.data.token;
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    log('2', 'Login successful');

    // Step 3: Get products or create test products
    log('3', 'Fetching products...');
    res = await api.get('/products');
    if (res.status !== 200) {
      error('3', 'Failed to fetch products', res.data);
      return;
    }
    const products = Array.isArray(res.data) ? res.data : res.data.products || [];
    if (products.length === 0) {
      error('3', 'No products available. Please create products first.');
      return;
    }
    productId = products[0]._id || products[0].id;
    log('3', `Found ${products.length} products`, `Using product: ${products[0].name} (ID: ${productId})`);

    // Step 4: Add product to cart
    log('4', 'Adding product to cart...');
    res = await api.post('/cart', {
      productId,
      quantity: 2,
    });
    if (res.status !== 201) {
      error('4', 'Failed to add to cart', res.data);
      return;
    }
    log('4', 'Product added to cart successfully');

    // Step 5: Get cart
    log('5', 'Getting cart...');
    res = await api.get('/cart');
    if (res.status !== 200) {
      error('5', 'Failed to get cart', res.data);
      return;
    }
    const cart = res.data;
    log('5', `Cart retrieved: ${cart.items.length} items`, `Total: ${cart.totalAmount} VNĐ`);

    // Step 6: Update cart item quantity
    log('6', 'Updating cart item quantity...');
    res = await api.put(`/cart/${productId}`, {
      quantity: 5,
    });
    if (res.status !== 200) {
      error('6', 'Failed to update cart', res.data);
      return;
    }
    log('6', 'Cart updated successfully', 'New quantity: 5');

    // Step 7: Get updated cart
    log('7', 'Getting updated cart...');
    res = await api.get('/cart');
    if (res.status !== 200) {
      error('7', 'Failed to get cart', res.data);
      return;
    }
    const updatedCart = res.data;
    log('7', `Updated cart: ${updatedCart.items.length} items`, `Total: ${updatedCart.totalAmount} VNĐ`);

    // Step 8: Add another product if available
    let secondProductId = null;
    if (products.length > 1) {
      secondProductId = products[1]._id;
      log('8', 'Adding second product to cart...');
      res = await api.post('/cart', {
        productId: secondProductId,
        quantity: 1,
      });
      if (res.status !== 201) {
        error('8', 'Failed to add second product', res.data);
        return;
      }
      log('8', 'Second product added successfully');
    }

    // Step 9: Get cart with multiple items
    log('9', 'Getting cart with multiple items...');
    res = await api.get('/cart');
    if (res.status !== 200) {
      error('9', 'Failed to get cart', res.data);
      return;
    }
    const multiCart = res.data;
    log('9', `Cart with multiple items: ${multiCart.items.length} items`, `Total: ${multiCart.totalAmount} VNĐ`);

    // Step 10: Remove item from cart
    if (secondProductId) {
      log('10', 'Removing second product from cart...');
      res = await api.delete(`/cart/${secondProductId}`);
      if (res.status !== 200) {
        error('10', 'Failed to remove from cart', res.data);
        return;
      }
      log('10', 'Product removed successfully');
    } else {
      log('10', 'Skipping remove test (only one product available)');
    }

    // Step 11: Get final cart
    log('11', 'Getting final cart...');
    res = await api.get('/cart');
    if (res.status !== 200) {
      error('11', 'Failed to get cart', res.data);
      return;
    }
    const finalCart = res.data;
    log('11', `Final cart: ${finalCart.items.length} items`, `Total: ${finalCart.totalAmount} VNĐ`);

    // Step 12: Checkout
    log('12', 'Creating order (checkout)...');
    const checkoutData = {
      fullname: testUser.name,
      email: testUser.email,
      phone: '0123456789',
      address: '123 Test Street, City',
      paymentMethod: 'cod', // Cash on delivery
      items: finalCart.items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };
    res = await api.post('/checkout', checkoutData);
    if (res.status !== 201) {
      error('12', 'Checkout failed', res.data);
      return;
    }
    const order = res.data.order;
    log('12', 'Order created successfully', `Order ID: ${order._id}`);

    // Step 13: Get user orders
    log('13', 'Getting user orders...');
    res = await api.get('/orders/my');
    if (res.status !== 200) {
      error('13', 'Failed to get orders', res.data);
      return;
    }
    const orders = Array.isArray(res.data) ? res.data : res.data.orders || [];
    log('13', `User has ${orders.length} order(s)`, `Latest order total: ${orders[0]?.totalAmount || 0} VNĐ`);

    // Step 14: Get specific order
    log('14', 'Getting specific order details...');
    res = await api.get(`/orders/${order._id}`);
    if (res.status !== 200) {
      error('14', 'Failed to get order', res.data);
      return;
    }
    const orderDetails = res.data.order || res.data;
    log('14', 'Order details retrieved', `Status: ${orderDetails.status}, Items: ${orderDetails.items.length}`);

    // Step 15: Verify cart is cleared after checkout
    log('15', 'Verifying cart is cleared after checkout...');
    res = await api.get('/cart');
    if (res.status !== 200) {
      error('15', 'Failed to get cart', res.data);
      return;
    }
    const clearedCart = res.data;
    if (clearedCart.items.length === 0) {
      log('15', 'Cart successfully cleared after checkout ✓');
    } else {
      error('15', 'Cart was not cleared', `Items remaining: ${clearedCart.items.length}`);
    }

    console.log('\n=== ALL TESTS PASSED ✓ ===\n');

  } catch (err) {
    error('FATAL', 'Test execution failed', err.message);
    console.error(err);
  }
}

// Run tests
runTests();
