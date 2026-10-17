import crypto from 'node:crypto';

export type UserRole = 'admin' | 'accountant' | 'auditor' | 'viewer';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export const demoUsers: Record<string, AuthUser> = {
  'admin@accountingnotes.local': {
    id: 'user-1',
    email: 'admin@accountingnotes.local',
    name: 'Admin User',
    role: 'admin',
  },
  'accountant@accountingnotes.local': {
    id: 'user-2',
    email: 'accountant@accountingnotes.local',
    name: 'Finance Manager',
    role: 'accountant',
  },
};

const passwordMap: Record<string, string> = {
  'admin@accountingnotes.local': 'admin123',
  'accountant@accountingnotes.local': 'manager123',
};

const JWT_SECRET = process.env.JWT_SECRET ?? 'accounting-notes-demo-secret';

export function signPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function issueToken(user: AuthUser) {
  const header = encodeBase64Url({ alg: 'HS256', typ: 'JWT' });
  const payload = encodeBase64Url({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12,
  });
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

export function verifyToken(token: string) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token');

  const [header, payload, signature] = parts;
  const expected = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    throw new Error('Invalid token signature');
  }

  const decoded = JSON.parse(decodeBase64Url(payload));
  if (decoded.exp && Date.now() / 1000 > decoded.exp) {
    throw new Error('Token expired');
  }
  return decoded;
}

export function authUser(email: string, password: string) {
  const user = demoUsers[email];
  if (!user) return null;
  if (passwordMap[email] !== password) return null;
  return user;
}

export function getUserFromRequest(req: { headers: { authorization?: string } }) {
  const header = req.headers.authorization ?? '';
  if (!header.startsWith('Bearer ')) return null;

  try {
    return verifyToken(header.slice(7));
  } catch {
    return null;
  }
}

function encodeBase64Url(value: unknown) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}
