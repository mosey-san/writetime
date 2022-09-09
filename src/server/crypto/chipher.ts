import crypto from 'crypto';
import { getENV } from '../utils/env';

export function chipher(data: string): string {
  const iv = crypto.randomBytes(8).toString('hex');
  const chipher = crypto.createCipheriv(
    'aes256',
    getENV('SECRET_KEY_FILE'),
    iv
  );

  let encrypted = chipher.update(data, 'utf-8', 'hex');
  encrypted += chipher.final('hex');

  return `${encrypted}:${iv}`;
}
