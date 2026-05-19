const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { signToken } = require('../middleware/auth');
const { createUser, verifyUserCredentials } = require('../services/userService');
const { validateRegister, validateLogin } = require('../middleware/validator');
const { requireAuth } = require('../middleware/auth');

router.post('/register', validateRegister, asyncHandler(async (req, res) => {
  const user = await createUser(req.body);
  const token = signToken(user);
  res.status(201).json({ success: true, user, token });
}));

router.post('/login', validateLogin, asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await verifyUserCredentials(email, password);
  const token = signToken(user);
  res.json({ success: true, user, token });
}));

router.get('/me', requireAuth, asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
}));

module.exports = router;
