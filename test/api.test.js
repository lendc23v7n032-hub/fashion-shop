process.env.ADMIN_EMAIL = 'admin@example.com';
process.env.ADMIN_PASSWORD = 'admin123';
process.env.JWT_SECRET = 'test-secret';

const request = require('supertest');
const { ensureAdminUser } = require('../services/userService');
const app = require('../server');

beforeAll(async () => {
  await ensureAdminUser();
});

describe('Backend API', () => {
  let adminToken;

  test('GET /api/products should return an array', async () => {
    const response = await request(app).get('/api/products');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('GET /api/discounts should return an array', async () => {
    const response = await request(app).get('/api/discounts');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/auth/login should return JWT token for admin', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'admin123' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.success).toBe(true);
    adminToken = response.body.token;
  });

  test('POST /api/products without admin token should return 401', async () => {
    const response = await request(app)
      .post('/api/products')
      .send({ name: 'Test Sản Phẩm', category: 'Áo', price: 100000 });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  test('POST /api/products with admin token should succeed', async () => {
    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test Sản Phẩm', category: 'Áo', price: 100000 });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Test Sản Phẩm');
  });
});
