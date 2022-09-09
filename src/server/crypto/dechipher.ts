import crypto from 'crypto';
import { getENV } from '../utils/env';

export function dechipher(data: string): string {
  const [encrypted, iv] = data.split(':');
  const dechipher = crypto.createDecipheriv(
    'aes256',
    getENV('SECRET_KEY_FILE'),
    iv
  );

  let decrypted = dechipher.update(encrypted, 'hex', 'utf-8');
  decrypted += dechipher.final('utf-8');

  return decrypted;
}
