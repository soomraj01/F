import jwt from 'jsonwebtoken';

// This middleware verifies the HTTP-only admin JWT before allowing private API access.
export function requireAdmin(request, response, next) {
  const token = request.cookies?.adminToken;
  if (!token) return response.status(401).json({ message: 'Authentication required.' });

  try {
    request.admin = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return response.status(401).json({ message: 'Your session has expired.' });
  }
}
