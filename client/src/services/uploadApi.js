const apiBaseUrl = import.meta.env.VITE_API_URL || (window.location.hostname.endsWith('vercel.app') ? 'https://server-virid-one-67.vercel.app/api' : 'http://localhost:5000/api');

// This function sends a selected image to the authenticated Cloudinary upload endpoint.
export async function uploadProjectImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch(`${apiBaseUrl}/uploads/image`, { method: 'POST', credentials: 'include', body: formData });
  let data = {};
  try { data = await response.json(); } catch { /* The server may return an empty error response. */ }
  if (!response.ok) throw new Error(data.message || `Image upload failed (HTTP ${response.status}).`);
  return data.url;
}
