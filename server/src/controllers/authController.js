import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const otpStore = new Map();
const otpLifetimeMs = 10 * 60 * 1000;
const maxAttempts = 5;

// This function sends an OTP only to the configured owner email address.
function createMailer() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
}

// This function starts a short-lived OTP challenge without storing the plain code.
export async function requestOtp(request, response) {
  const email = String(request.body.email || '').trim().toLowerCase();
  if (!email || email !== process.env.ADMIN_EMAIL?.toLowerCase()) return response.status(401).json({ message: 'Use the owner email address.' });

  const mailer = createMailer();
  if (!mailer) return response.status(503).json({ message: 'Email delivery is not configured on the server.' });

  const otp = crypto.randomInt(100000, 1000000).toString();
  otpStore.set(email, { hash: crypto.createHash('sha256').update(otp).digest('hex'), expiresAt: Date.now() + otpLifetimeMs, attempts: 0 });
  await mailer.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'Your Soom Raj portfolio login code',
    text: `Your login code is ${otp}. It expires in 10 minutes.`,
  });
  return response.json({ message: 'A login code was sent to your email.' });
}

// This function verifies the OTP and creates a seven-day HTTP-only admin session.
export function verifyOtp(request, response) {
  const email = String(request.body.email || '').trim().toLowerCase();
  const code = String(request.body.otp || '').trim();
  const challenge = otpStore.get(email);
  if (!challenge || challenge.expiresAt < Date.now() || challenge.attempts >= maxAttempts) return response.status(401).json({ message: 'This code is invalid or expired.' });
  challenge.attempts += 1;
  const hash = crypto.createHash('sha256').update(code).digest('hex');
  if (hash !== challenge.hash) return response.status(401).json({ message: 'This code is invalid or expired.' });

  otpStore.delete(email);
  const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
  response.cookie('adminToken', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });
  return response.json({ authenticated: true });
}

// This function lets the frontend restore authentication after a page refresh.
export function currentAdmin(request, response) {
  return response.json({ authenticated: Boolean(request.admin) });
}

// This function removes the HTTP-only admin session cookie.
export function logout(_request, response) {
  response.clearCookie('adminToken');
  return response.status(204).send();
}
