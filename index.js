import * as qs from 'qs';
import * as crypto from 'crypto';
import { default as axios } from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

let token = '';

const config = {
  host: process.env.HOST,
  accessKey: process.env.ACCESS_KEY,
  secretKey: process.env.SECRET_KEY,
  deviceId: process.env.DEVICE_ID,
};

const httpClient = axios.create({
  baseURL: config.host,
  timeout: 5 * 1e3,
});

async function main() {
  await getToken();
  const data = await getDeviceSpesification(config.deviceId);
  console.log('fetch success: ', data);
}

/**
 * fetch highway login token
 */
async function getToken() {
  const method = 'GET';
  const timestamp = Date.now().toString();
  const signUrl = '/v1.0/token?grant_type=1';
  const contentHash = crypto.createHash('sha256').update('').digest('hex');
  const stringToSign = [method, contentHash, '', signUrl].join('\n');
  const signStr = config.accessKey + timestamp + stringToSign;

  const headers = {
    t: timestamp,
    sign_method: 'HMAC-SHA256',
    client_id: config.accessKey,
    sign: await encryptStr(signStr, config.secretKey),
  };
  const { data: login } = await httpClient.get('/v1.0/token?grant_type=1', { headers });
  if (!login || !login.success) {
    throw Error(`fetch failed: ${login.msg}`);
  }
  token = login.result.access_token;
}

/**
 * fetch highway business data
 */
async function getDeviceSpesification(deviceId) {
  const query = {};
  const method = 'GET';
  const url = `/v1.0/devices/${deviceId}`;
  const reqHeaders = await getRequestSign(url, method, {}, query);

  const { data } = await httpClient.request({
    method,
    data: {},
    params: {},
    headers: reqHeaders,
    url: reqHeaders.path,
  });
  if (!data || !data.success) {
    throw Error(`request api failed: ${data.msg}`);
  }else{
    return data
  }
}

/**
 * fetch highway business data
 */
async function getDeviceInfo(deviceId) {
  const query = {};
  const method = 'POST';
  const url = `/v1.0/devices/${deviceId}/commands`;
  const reqHeaders = await getRequestSign(url, method, {}, query);

  const { data } = await httpClient.request({
    method,
    data: {},
    params: {},
    headers: reqHeaders,
    url: reqHeaders.path,
  });
  if (!data || !data.success) {
    throw Error(`request api failed: ${data.msg}`);
  }
}

/**
 * HMAC-SHA256 crypto function
 */
async function encryptStr(str, secret){
  return crypto.createHmac('sha256', secret).update(str, 'utf8').digest('hex').toUpperCase();
}

/**
 * request sign, save headers 
 * @param path
 * @param method
 * @param headers
 * @param query
 * @param body
 */
async function getRequestSign(
  path,
  method,
  headers = {},
  query = {},
  body = {},
) {
  const t = Date.now().toString();
  const [uri, pathQuery] = path.split('?');
  const queryMerged = Object.assign(query, qs.parse(pathQuery));
  const sortedQuery = {};
  Object.keys(queryMerged)
    .sort()
    .forEach((i) => (sortedQuery[i] = query[i]));

  const querystring = decodeURIComponent(qs.stringify(sortedQuery));
  const url = querystring ? `${uri}?${querystring}` : uri;
  const contentHash = crypto.createHash('sha256').update(JSON.stringify(body)).digest('hex');
  const stringToSign = [method, contentHash, '', url].join('\n');
  const signStr = config.accessKey + token + t + stringToSign;
  return {
    t,
    path: url,
    client_id: config.accessKey,
    sign: await encryptStr(signStr, config.secretKey),
    sign_method: 'HMAC-SHA256',
    access_token: token,
  };
}

main().catch(err => {
  console.error(err)
  throw Error(`error: ${err}`);
});