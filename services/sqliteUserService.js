const bcrypt = require('bcryptjs');
const { db } = require('./db');

function sanitizeUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

async function getUserById(userId) {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  return row || null;
}

async function getUserByEmail(email) {
  if (!email) return null;
  const normalizedEmail = String(email).trim().toLowerCase();
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);
  return row || null;
}

async function createUser({ email, password, role = 'user' }) {
  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = await getUserByEmail(normalizedEmail);
  if (existing) {
    throw new Error('Email đã tồn tại');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: `U-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
    email: normalizedEmail,
    password: hashedPassword,
    role,
    createdAt: new Date().toISOString(),
    updatedAt: null,
  };

  db.prepare(
    `INSERT INTO users (id, email, password, role, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(user.id, user.email, user.password, user.role, user.createdAt, user.updatedAt);

  return sanitizeUser(user);
}

async function verifyUserCredentials(email, password) {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error('Email hoặc mật khẩu không đúng');
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new Error('Email hoặc mật khẩu không đúng');
  }

  return sanitizeUser(user);
}

async function isAdminExists() {
  const row = db.prepare('SELECT COUNT(*) AS count FROM users WHERE role = ?').get('admin');
  return row.count > 0;
}

async function ensureAdminUser() {
  const email = process.env.ADMIN_EMAIL || process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    return;
  }

  const existing = await getUserByEmail(email);
  if (existing) {
    if (existing.role !== 'admin') {
      db.prepare('UPDATE users SET role = ?, updatedAt = ? WHERE email = ?').run('admin', new Date().toISOString(), existing.email);
    }
    return;
  }

  await createUser({ email, password, role: 'admin' });
}

module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
  verifyUserCredentials,
  isAdminExists,
  ensureAdminUser,
};