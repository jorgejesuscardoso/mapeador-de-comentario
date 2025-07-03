// src/utils/hash.ts
import bcrypt from 'bcryptjs';

export async function generateHash(plainTextSenha: string): Promise<string> {
  const saltRounds = 10; 
  const hash = await bcrypt.hash(plainTextSenha, saltRounds);
  return hash;
}

export async function verifyHash(plainTextSenha: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(plainTextSenha, hashed);
}
