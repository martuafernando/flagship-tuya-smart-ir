import { default as axios } from 'axios';
import { config } from './config.js';
import { getToken } from './get/get-token.js';

import { getDeviceInformation } from './get/get-device-information.js';

const httpClient = axios.create({
  baseURL: config.host,
  timeout: 5 * 1e3,
});

async function main() {
  config.token = await getToken(httpClient);
  const data = await getDeviceInformation(httpClient, config.deviceId);
  console.log('fetch success: ', data);
}

main().catch(err => {
  console.error(err)
  // throw Error(`error: ${err}`);
});