const apiBaseUrl = import.meta.env.VITE_API_URL || (window.location.hostname.endsWith('vercel.app') ? 'https://server-virid-one-67.vercel.app/api' : 'http://localhost:5000/api');

// This function requests a one-time login code from the server email provider.
export async function requestLoginOtp(email) {
  const response = await fetch(`${apiBaseUrl}/auth/request-otp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ email }) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Could not send the login code.');
  return data;
}

// This function verifies the one-time code and lets the server set the JWT cookie.
export async function verifyLoginOtp(email, otp) {
  const response = await fetch(`${apiBaseUrl}/auth/verify-otp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ email, otp }) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Could not verify the login code.');
  return data;
}

// This function checks whether the browser still has a valid HTTP-only admin session.
export async function getCurrentAdmin() {
  const response = await fetch(`${apiBaseUrl}/auth/me`, { credentials: 'include' });
  return response.ok;
}

// This function asks the server to clear the HTTP-only admin session.
export async function logoutAdmin() {
  await fetch(`${apiBaseUrl}/auth/logout`, { method: 'POST', credentials: 'include' });
}
