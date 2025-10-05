import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()

const SECRET_KEY = process.env.LUNAR_KEY || '0800';
const ONE_SHOT_KEY = process.env.ONE_SHOT_KEY || 'saibot';

// --------- Pre-token (handshake) ---------
export function generatePreToken(payload: object): { token: string } {
  const token = jwt.sign(payload, ONE_SHOT_KEY, {
    expiresIn: '30s', // 30 segundos é mais safe que 5s
  });
  return { token };
}

export function verifyPreToken(token?: string): boolean {
  if (!token) return false;
  try {
    jwt.verify(token, ONE_SHOT_KEY);
    return true;
  } catch {
    return false;
  }
}

// --------- Token de sessão (login de verdade) ---------
export function generateSessionToken(payload: object): { token: string } {
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: '2d', // tempo maior pra sessão
  });
  return { token };
}

export function verifySessionToken(authorizationHeader?: string): boolean {
  if (!authorizationHeader) return false;

  const parts = authorizationHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return false;

  const token = parts[1];
  try {
    jwt.verify(token, SECRET_KEY);
    return true;
  } catch {
    return false;
  }
}

export function verifyWsToken(token: string): boolean {
  try {
    jwt.verify(token, SECRET_KEY);
    return true;
  } catch {
    return false;
  }
}

// --------- Decode (ler payload sem validar) ---------
export function decodeToken(token: string) {
  try {
    const decoded = jwt.decode(token)
    return decoded || null;
  } catch {
    return null;
  }
}
