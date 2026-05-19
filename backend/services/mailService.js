const nodemailer = require('nodemailer');

let transporter;

const normalizeEnvValue = (value) => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isGmailTransport = ({ service, host }) =>
  service.toLowerCase() === 'gmail' || host.toLowerCase() === 'smtp.gmail.com';
const toFriendlyMailError = (error) => {
  const message = error?.message || 'Unable to send email right now.';

  if (message.includes('BadCredentials') || message.includes('Username and Password not accepted')) {
    return new Error('Gmail login failed. Please verify EMAIL_USER/SMTP_USER and use a valid Gmail App Password in EMAIL_PASS/SMTP_PASS.');
  }

  if (message.includes('Invalid login')) {
    return new Error('SMTP login failed. Please verify your mail username and password.');
  }

  return error instanceof Error ? error : new Error(message);
};

const getMailConfig = () => {
  const service = normalizeEnvValue(process.env.MAIL_SERVICE || process.env.SMTP_SERVICE || 'Gmail');
  const user = normalizeEnvValue(process.env.SMTP_USER || process.env.EMAIL_USER);
  const host = normalizeEnvValue(process.env.SMTP_HOST);
  const port = normalizeEnvValue(process.env.SMTP_PORT);
  const rawPass = normalizeEnvValue(process.env.SMTP_PASS || process.env.EMAIL_PASS);
  const pass = isGmailTransport({ service, host }) ? rawPass.replace(/\s+/g, '') : rawPass;
  const secure = process.env.SMTP_SECURE === 'true' || Number(port) === 465;
  const configuredFrom = normalizeEnvValue(
    process.env.SMTP_FROM || process.env.EMAIL_FROM || process.env.SMTP_USER || process.env.EMAIL_USER
  );
  const from = isValidEmail(configuredFrom) ? configuredFrom : user;

  return { service, user, pass, host, port, secure, from };
};

const getTransporter = () => {
  if (transporter) return transporter;

  const { service, user, pass, host, port, secure } = getMailConfig();

  if (!user || !pass) {
    throw new Error('Email is not configured. Please set SMTP_USER/SMTP_PASS or EMAIL_USER/EMAIL_PASS.');
  }

  transporter = host && port
    ? nodemailer.createTransport({
        host,
        port: Number(port),
        secure,
        auth: { user, pass },
      })
    : nodemailer.createTransport({
        service,
        auth: { user, pass },
      });

  return transporter;
};

const sendMail = async ({ to, subject, html, text }) => {
  const { from } = getMailConfig();
  const mailer = getTransporter();

  if (!isValidEmail(from)) {
    throw new Error('Email sender address is invalid. Please set SMTP_FROM or EMAIL_FROM to a valid email.');
  }

  try {
    return await mailer.sendMail({
      from: `"BohoJazz" <${from}>`,
      to,
      subject,
      html,
      text,
    });
  } catch (error) {
    throw toFriendlyMailError(error);
  }
};

const verifyMailTransport = async () => {
  try {
    const mailer = getTransporter();
    await mailer.verify();
  } catch (error) {
    throw toFriendlyMailError(error);
  }
};

module.exports = { sendMail, verifyMailTransport };
