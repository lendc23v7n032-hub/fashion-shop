const bcrypt = require('bcryptjs');
const sqliteUserService = require('./sqliteUserService');

function sanitizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

async function getUserById(userId) {
  return sqliteUserService.getUserById(userId);
}

async function getUserByEmail(email) {
  return sqliteUserService.getUserByEmail(email);
}

async function createUser({ email, password, role = 'user' }) {
  return sqliteUserService.createUser({ email, password, role });
}

async function verifyUserCredentials(email, password) {
  return sqliteUserService.verifyUserCredentials(email, password);
}

async function isAdminExists() {
  return sqliteUserService.isAdminExists();
}

async function ensureAdminUser() {
  if (await isAdminExists()) {
    return;
  }

  const email = process.env.ADMIN_EMAIL || process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    return;
  }

  return sqliteUserService.ensureAdminUser();
}

module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
  verifyUserCredentials,
  ensureAdminUser,
};
