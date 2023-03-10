import * as crypto from 'crypto';
/**
 * HMAC-SHA256 crypto function
 */
export async function encryptStr(str, secret){
  return crypto.createHmac('sha256', secret).update(str, 'utf8').digest('hex').toUpperCase();
}