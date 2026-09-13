import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { supabase } from './db';

// Session storage for owner auth tokens
interface AdminSession {
  token: string;
  email: string;
  createdAt: number;
  expiresAt: number;
}

const activeSessions = new Map<string, AdminSession>();

// Secret used to sign admin session tokens
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'elora_haute_parfumerie_admin_secret_key_2026';

export function createAdminToken(email: string): string {
  const payload = `${email}:${Date.now()}:${crypto.randomBytes(16).toString('hex')}`;
  const hmac = crypto.createHmac('sha256', ADMIN_JWT_SECRET).update(payload).digest('hex');
  const token = Buffer.from(`${payload}:${hmac}`).toString('base64');

  activeSessions.set(token, {
    token,
    email,
    createdAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
}

export function verifyAdminToken(token: string): { valid: boolean; email?: string } {
  if (!token) return { valid: false };

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length < 4) return { valid: false };

    const [email, timestamp, nonce, signature] = parts;
    const payload = `${email}:${timestamp}:${nonce}`;
    const expectedSig = crypto.createHmac('sha256', ADMIN_JWT_SECRET).update(payload).digest('hex');

    if (expectedSig !== signature) {
      return { valid: false };
    }

    // Check expiration
    const created = parseInt(timestamp, 10);
    if (Date.now() - created > 7 * 24 * 60 * 60 * 1000) {
      return { valid: false };
    }

    return { valid: true, email };
  } catch (err) {
    return { valid: false };
  }
}

/**
 * Express middleware to guard all /api/admin/* endpoints.
 * Requires a valid Bearer token from Supabase Auth or verified Admin Session.
 */
export async function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required.' });
  }

  const token = authHeader.substring(7);

  // 1. Check local admin token
  const localCheck = verifyAdminToken(token);
  if (localCheck.valid) {
    (req as any).adminEmail = localCheck.email;
    return next();
  }

  // 2. If Supabase is active, check Supabase JWT
  if (supabase) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        (req as any).adminEmail = user.email;
        return next();
      }
    } catch (err) {
      // Continue to reject
    }
  }

  return res.status(401).json({ error: 'Unauthorized: Invalid or expired admin session token.' });
}
