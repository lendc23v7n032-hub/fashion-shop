const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { securityHeaders, corsOptions, apiLimiter, checkoutLimiter, authLimiter } = require('./middleware/security');
const { errorHandler, notFoundHandler, asyncHandler } = require('./middleware/errorHandler');
const { validateCheckout } = require('./middleware/validator');
const { ensureAdminUser } = require('./services/userService');
const { createOrder } = require('./services/orderService');
const { initDatabase } = require('./services/dbClient');

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const discountsRouter = require('./routes/discounts');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;
const frontendDir = path.join(__dirname, '..', 'nl1');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(apiLimiter);
app.use(express.static(frontendDir));

app.use('/api/auth', authLimiter, authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/discounts', discountsRouter);

app.post('/api/checkout', checkoutLimiter, validateCheckout, asyncHandler(async (req, res) => {
  const order = await createOrder(req.body);
  res.status(201).json(order);
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  await initDatabase();

  await ensureAdminUser();
  await require('./services/productService').initializeProducts();
  await require('./services/discountService').initializeDiscounts();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

if (require.main === module) {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

module.exports = app;

