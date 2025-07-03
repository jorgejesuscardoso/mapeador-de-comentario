// src/utils/token.ts
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'lunar';

// Gera um token JWT
export function generateToken(payload: object): { token: string } {
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: '2h', // ou '1d', '15m', etc
  });

  return { token };
}

// Verifica e valida um token JWT
export function verifyToken(authorizationHeader?: string): boolean {
  if (!authorizationHeader) return false;

  // Espera-se algo como: Bearer <token>
  const parts = authorizationHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') return false;

  const token = parts[1];

  try {
    jwt.verify(token, SECRET_KEY);
    return true;
  } catch (err) {
    return false;
  }
}
