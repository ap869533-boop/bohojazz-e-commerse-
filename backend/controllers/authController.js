const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { validationResult } = require('express-validator');
const { sendMail } = require('../services/mailService');

let resetTableReady;
const isDevelopment = process.env.NODE_ENV !== 'production';
const isMailOptional = process.env.MAIL_REQUIRED !== 'true';

const ensurePasswordResetTable = async () => {
  if (!resetTableReady) {
    resetTableReady = db.execute(`
      CREATE TABLE IF NOT EXISTS password_reset_otps (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        email VARCHAR(191) NOT NULL,
        otp_hash VARCHAR(255) NOT NULL,
        expires_at DATETIME NOT NULL,
        attempts INT NOT NULL DEFAULT 0,
        verified_at DATETIME NULL,
        consumed_at DATETIME NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_password_reset_email (email),
        INDEX idx_password_reset_user (user_id)
      )
    `);
  }

  await resetTableReady;
};

const generateTokens = (user) => {
  const payload = { id: user.id, uuid: user.uuid, role: user.role, email: user.email };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' });
  return { accessToken, refreshToken };
};

const generateOtp = () => `${Math.floor(100000 + Math.random() * 900000)}`;

const buildResetOtpEmail = (name, otp) => ({
  subject: 'BohoJazz password reset OTP',
  html: `
    <div style="font-family: Arial, sans-serif; color: #1a1208; max-width: 560px; margin: 0 auto; padding: 24px;">
      <h2 style="margin-bottom: 8px;">BohoJazz Password Reset</h2>
      <p style="margin: 0 0 16px;">Hi ${name || 'there'},</p>
      <p style="margin: 0 0 16px;">Use this OTP to reset your BohoJazz account password:</p>
      <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; background: #fcf7ef; border: 1px solid #eadfce; border-radius: 12px; padding: 18px 20px; text-align: center; margin: 16px 0;">
        ${otp}
      </div>
      <p style="margin: 0 0 8px;">This OTP expires in 10 minutes.</p>
      <p style="margin: 0; color: #7c6a5d;">If you did not request this, you can ignore this email.</p>
    </div>
  `,
  text: `Your BohoJazz password reset OTP is ${otp}. It expires in 10 minutes.`,
});

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

// @POST /api/auth/forgot-password/request-otp
const requestPasswordResetOtp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

  const { email } = req.body;

  try {
    await ensurePasswordResetTable();

    const [users] = await db.execute(
      'SELECT id, name, email, status FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (!users.length || users[0].status !== 'active') {
      return res.json({
        success: true,
        message: 'If this email is registered, an OTP has been sent.',
      });
    }

    const user = users[0];
    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.execute(
      'UPDATE password_reset_otps SET consumed_at = NOW() WHERE user_id = ? AND consumed_at IS NULL',
      [user.id]
    );

    await db.execute(
      'INSERT INTO password_reset_otps (user_id, email, otp_hash, expires_at) VALUES (?, ?, ?, ?)',
      [user.id, user.email, otpHash, expiresAt]
    );

    const mail = buildResetOtpEmail(user.name, otp);

    try {
      await sendMail({
        to: user.email,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      });
    } catch (mailError) {
      if (!isDevelopment || !isMailOptional) {
        throw mailError;
      }

      console.warn('Password reset OTP mail failed in development mode:', mailError.message);
      console.warn(`Development OTP for ${user.email}: ${otp}`);

      return res.json({
        success: true,
        message: 'Mail failed in development mode. Use the OTP from the backend console.',
        devOtp: otp,
      });
    }

    res.json({
      success: true,
      message: 'OTP has been sent to your email.',
    });
  } catch (err) {
    if (isDevelopment && isMailOptional) {
      console.warn('Request password reset OTP warning:', err.message);
    } else {
      console.error('Request password reset OTP error:', err);
    }
    res.status(500).json({ success: false, message: err.message || 'Unable to send OTP right now.' });
  }
};

// @POST /api/auth/forgot-password/reset
const resetPasswordWithOtp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

  const { email, otp, newPassword } = req.body;

  try {
    await ensurePasswordResetTable();

    const [otps] = await db.execute(
      `SELECT pro.id, pro.user_id, pro.otp_hash, pro.attempts, pro.expires_at, u.status
       FROM password_reset_otps pro
       JOIN users u ON u.id = pro.user_id
       WHERE pro.email = ? AND pro.consumed_at IS NULL
       ORDER BY pro.created_at DESC
       LIMIT 1`,
      [email]
    );

    if (!otps.length) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
    }

    const otpRow = otps[0];
    if (otpRow.status !== 'active') {
      return res.status(403).json({ success: false, message: 'This account is not active.' });
    }

    if (new Date(otpRow.expires_at) < new Date()) {
      await db.execute('UPDATE password_reset_otps SET consumed_at = NOW() WHERE id = ?', [otpRow.id]);
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    if (otpRow.attempts >= 5) {
      await db.execute('UPDATE password_reset_otps SET consumed_at = NOW() WHERE id = ?', [otpRow.id]);
      return res.status(429).json({ success: false, message: 'Too many incorrect OTP attempts. Request a new OTP.' });
    }

    const isValidOtp = await bcrypt.compare(otp, otpRow.otp_hash);
    if (!isValidOtp) {
      await db.execute('UPDATE password_reset_otps SET attempts = attempts + 1 WHERE id = ?', [otpRow.id]);
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, otpRow.user_id]);
    await db.execute(
      'UPDATE password_reset_otps SET verified_at = NOW(), consumed_at = NOW() WHERE id = ?',
      [otpRow.id]
    );
    await db.execute('DELETE FROM refresh_tokens WHERE user_id = ?', [otpRow.user_id]);

    res.json({ success: true, message: 'Password reset successful. Please sign in with your new password.' });
  } catch (err) {
    console.error('Reset password with OTP error:', err);
    res.status(500).json({ success: false, message: 'Unable to reset password right now.' });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  changePassword,
  requestPasswordResetOtp,
  resetPasswordWithOtp,
};
