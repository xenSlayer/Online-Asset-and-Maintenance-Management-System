import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { toFrontendRole } from '../utils/role';

interface LoginInput {
  email: string;
  password: string;
}

export class AuthError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 401) {
    super(message);
    this.statusCode = statusCode;
  }
}

export async function loginUser({ email, password }: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user) {
    throw new AuthError('Invalid email or password');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new AuthError('Invalid email or password');
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    secret,
    { expiresIn: '7d' },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: toFrontendRole(user.role),
    },
  };
}
