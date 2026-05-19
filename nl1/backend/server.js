const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { readJSON, writeJSON } = require('./helpers/dataStore');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

app.use(cors());
app.use(bodyParser.json());

// Serve static frontend if desired
app.use('/', express.static(path.join(__dirname, '..')));

// --- Auth ---
app.post('/api/auth/register', async (req, res) => {
  const { fullname, email, password, phone, address } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email và password required' });

  const users = await readJSON('users.json');
  if (users.find(u => u.email === email)) return res.status(409).json({ message: 'Email đã tồn tại' });

  const hash = await bcrypt.hash(password, 10);
  const user = { id: 'USR-' + Date.now(), fullname: fullname || '', email, password: hash, phone: phone || '', address: address || '', role: 'customer', createdAt: new Date().toISOString() };
  users.push(user);
  await writeJSON('users.json', users);
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ user: { id: user.id, email: user.email, fullname: user.fullname, role: user.role }, token });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email và password required' });
  const users = await readJSON('users.json');
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: 'Không tìm thấy tài khoản' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Sai mật khẩu' });
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ user: { id: user.id, email: user.email, fullname: user.fullname, role: user.role }, token });
});

function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Unauthorized' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Invalid Authorization' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
}

// --- Products CRUD ---
app.get('/api/products', async (req, res) => {
  const products = await readJSON('products.json');
  res.json(products);
});

app.get('/api/products/:id', async (req, res) => {
  const products = await readJSON('products.json');
  const p = products.find(x => x.id === req.params.id);
  if (!p) return res.status(404).json({ message: 'Not found' });
  res.json(p);
});

app.post('/api/products', authenticate, requireAdmin, async (req, res) => {
  const products = await readJSON('products.json');
  const { name, category, price, image, rating, description } = req.body;
  const id = (products.length + 1).toString().padStart(3, '0');
  const newP = { id, name, category, price: Number(price) || 0, image: image || '', rating: Number(rating) || 0, sold: 0, createdAt: new Date().toISOString(), description: description || '' };
  products.push(newP);
  await writeJSON('products.json', products);
  res.status(201).json(newP);
});

app.put('/api/products/:id', authenticate, requireAdmin, async (req, res) => {
  const products = await readJSON('products.json');
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  const updated = Object.assign(products[idx], req.body);
  products[idx] = updated;
  await writeJSON('products.json', products);
  res.json(updated);
});

app.delete('/api/products/:id', authenticate, requireAdmin, async (req, res) => {
  let products = await readJSON('products.json');
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  const removed = products.splice(idx, 1)[0];
  await writeJSON('products.json', products);
  res.json(removed);
});

// --- Orders / Checkout ---
app.post('/api/checkout', async (req, res) => {
  const { fullname, phone, address, email, paymentMethod, items, discountCode, discountAmount } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Cart empty' });

  const orders = await readJSON('orders.json');
  const products = await readJSON('products.json');

  const orderId = 'ORD-' + Date.now();
  const date = new Date().toISOString();
  const subtotal = items.reduce((s, it) => {
    const p = products.find(x => x.id === it.productId);
    return s + (p ? p.price * it.quantity : 0);
  }, 0);
  const shipping = subtotal > 500000 ? 0 : 50000;
  const tax = Math.round(subtotal * 0.1);
  const totalBeforeDiscount = subtotal + shipping + tax;
  const discount = Number(discountAmount || 0);
  const total = Math.max(0, totalBeforeDiscount - discount);

  const order = { id: orderId, date, userEmail: (email||'').toLowerCase(), fullname, phone, shippingAddress: address, paymentMethod: paymentMethod || 'card', items, status: 'processing', estimatedDeliveryDate: new Date(Date.now() + 4*24*3600*1000).toISOString(), discountCode: discountCode||'', discountAmount: discount, total };

  // update product sold counts
  items.forEach(it => {
    const p = products.find(x => x.id === it.productId);
    if (p) p.sold = (p.sold || 0) + (it.quantity || 0);
  });

  orders.push(order);
  await writeJSON('orders.json', orders);
  await writeJSON('products.json', products);

  res.status(201).json(order);
});

app.get('/api/orders', authenticate, async (req, res) => {
  const orders = await readJSON('orders.json');
  if (req.user.role === 'admin') return res.json(orders);
  const mine = orders.filter(o => (o.userEmail || '').toLowerCase() === (req.user.email || '').toLowerCase());
  res.json(mine);
});

// --- Admin utilities: create initial admin (run once) ---
app.post('/api/admin/create-initial', async (req, res) => {
  const users = await readJSON('users.json');
  if (users.find(u => u.role === 'admin')) return res.status(400).json({ message: 'Admin exists' });
  const { email, password, fullname } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'email/password required' });
  const hash = await bcrypt.hash(password, 10);
  const admin = { id: 'USR-' + Date.now(), fullname: fullname || 'Admin', email, password: hash, role: 'admin', createdAt: new Date().toISOString() };
  users.push(admin);
  await writeJSON('users.json', users);
  res.json({ message: 'admin created', admin: { id: admin.id, email: admin.email } });
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
