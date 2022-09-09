import { getENV } from '../utils/env';
import jsonWebToken, { Jwt, JwtPayload, TokenExpiredError } from 'jsonwebtoken';

interface VerifyResult {
  success: boolean;
  payload?: string | JwtPayload | null;
  reason?: 'expired' | 'error';
}

export class JWT {
  static sign(
    payload: string | object | Buffer,
    options: jsonWebToken.SignOptions | undefined = undefined
  ) {
    return jsonWebToken.sign(payload, getENV('SECRET_KEY_FILE'), options);
  }
  static verify(JWT: string) {
    let result: VerifyResult = { success: true };
    try {
      result.payload = jsonWebToken.verify(JWT, getENV('SECRET_KEY_FILE'));
    } catch (error) {
      result.success = false;
      if (error instanceof TokenExpiredError) {
        result.reason = 'expired';
        result.payload = jsonWebToken.decode(JWT);
      } else {
        result.reason = 'error';
      }
    }
    return result;
  }
}
