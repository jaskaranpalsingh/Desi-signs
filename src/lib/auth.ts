import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'desi_signs_super_secure_jwt_secret_key_2026_edmonton';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@desisigns.ca';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AdminDesiSigns2026!';

export interface AdminUser {
  email: string;
  name: string;
  role: string;
}

export async function verifyAdminCredentials(email: string, pass: string): Promise<AdminUser | null> {
  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail === ADMIN_EMAIL.toLowerCase()) {
    // Check against configured admin password
    const matches = pass === ADMIN_PASSWORD || (await bcrypt.compare(pass, ADMIN_PASSWORD).catch(() => false));
    if (matches) {
      return {
        email: ADMIN_EMAIL,
        name: 'Desi Signs Administrator',
        role: 'superadmin',
      };
    }
  }
  return null;
}

export function signAdminToken(user: AdminUser): string {
  return jwt.sign(
    {
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyAdminToken(token: string): AdminUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminUser;
    return decoded;
  } catch (e) {
    return null;
  }
}

export function getAdminSessionFromCookieHeader(cookieHeader?: string | null): AdminUser | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|;\s*)desi_admin_token=([^;]+)/);
  if (!match?.[1]) return null;
  try {
    return verifyAdminToken(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('desi_admin_token')?.value;
    if (!token) return null;
    return verifyAdminToken(token);
  } catch (e) {
    return null;
  }
}

