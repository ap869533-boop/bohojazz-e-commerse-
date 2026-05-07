const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { validationResult } = require('express-validator');

const generateTokens = (user) => {
  const payload = { id: user.id, uuid: user.uuid, role: user.role, email: user.email };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' });
  return { accessToken, refreshToken };
};

// @POST /api/auth/register
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

  const { name, email, password, phone, role = 'user' } = req.body;
  const allowedRoles = ['user', 'vendor'];
  const userRole = allowedRoles.includes(role) ? role : 'user';

  try {
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const userUUID = uuidv4();

    const [result] = await db.execute(
      'INSERT INTO users (uuid, name, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
      [userUUID, name, email, hashedPassword, phone || null, userRole]
    );

    const userId = result.insertId;

    // Create vendor profile if role is vendor
    if (userRole === 'vendor') {
      const shopSlug = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
      await db.execute(
        'INSERT INTO vendor_profiles (user_id, shop_name, shop_slug) VALUES (?, ?, ?)',
        [userId, name + "'s Shop", shopSlug]
      );
    }

    const newUser = { id: userId, uuid: userUUID, role: userRole, email };
    const { accessToken, refreshToken } = generateTokens(newUser);

    // Save refresh token
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await db.execute('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [userId, refreshToken, expiresAt]);

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      data: { accessToken, refreshToken, user: { id: userId, uuid: userUUID, name, email, role: userRole } }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @POST /api/auth/login
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

  const { email, password } = req.body;

  try {
    const [users] = await db.execute(
      'SELECT id, uuid, name, email, password, role, status, avatar FROM users WHERE email = ?',
      [email]
    );

    if (!users.length) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = users[0];

    if (user.status === 'banned') {
      return res.status(403).json({ success: false, message: 'Your account has been banned.' });
    }
    if (user.status === 'inactive') {
      return res.status(403).json({ success: false, message: 'Your account is inactive.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await db.execute('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, refreshToken, expiresAt]);

    let vendorProfile = null;
    if (user.role === 'vendor') {
      const [vp] = await db.execute('SELECT id, shop_name, shop_slug, is_approved FROM vendor_profiles WHERE user_id = ?', [user.id]);
      if (vp.length) vendorProfile = vp[0];
    }

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        accessToken,
        refreshToken,
        user: { id: user.id, uuid: user.uuid, name: user.name, email: user.email, role: user.role, avatar: user.avatar, vendorProfile }
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @POST /api/auth/refresh
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ success: false, message: 'Refresh token required.' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const [tokens] = await db.execute(
      'SELECT id FROM refresh_tokens WHERE token = ? AND user_id = ? AND expires_at > NOW()',
      [refreshToken, decoded.id]
    );

    if (!tokens.length) return res.status(401).json({ success: false, message: 'Invalid or expired refresh token.' });

    const [users] = await db.execute('SELECT id, uuid, name, email, role, status FROM users WHERE id = ?', [decoded.id]);
    if (!users.length || users[0].status !== 'active') {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    const user = users[0];
    const newTokens = generateTokens(user);

    // Rotate refresh token
    await db.execute('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await db.execute('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, newTokens.refreshToken, expiresAt]);

    res.json({ success: true, data: newTokens });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid refresh token.' });
  }
};

// @POST /api/auth/logout
const logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await db.execute('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]).catch(() => {});
  }
  res.json({ success: true, message: 'Logged out successfully.' });
};

// @GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT id, uuid, name, email, phone, role, status, avatar, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!users.length) return res.status(404).json({ success: false, message: 'User not found.' });

    let vendorProfile = null;
    if (users[0].role === 'vendor') {
      const [vp] = await db.execute('SELECT * FROM vendor_profiles WHERE user_id = ?', [users[0].id]);
      if (vp.length) vendorProfile = vp[0];
    }

    res.json({ success: true, data: { ...users[0], vendorProfile } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @PUT /api/auth/change-password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const [users] = await db.execute('SELECT password FROM users WHERE id = ?', [req.user.id]);
    const isMatch = await bcrypt.compare(currentPassword, users[0].password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect.' });

    const hashed = await bcrypt.hash(newPassword, 12);
    await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);
    // Invalidate all refresh tokens
    await db.execute('DELETE FROM refresh_tokens WHERE user_id = ?', [req.user.id]);

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { register, login, refreshToken, logout, getMe, changePassword };
