import { config } from './config.js';

import { getToken } from './get/get-token.js';
import { getDeviceInformation } from './get/get-device-information.js';
import { getDeviceSpesification } from './get/get-device-spesification.js';
import { getDeviceFunctions } from './get/get-device-functions.js';
import { getCategoryFunctions } from './get/get-category-functions.js';
import { getCategoryList } from './get/get-category-list.js';
import { getDeviceStatus } from './get/get-device-status.js';

async function main() {
  config.token = await getToken();

  console.log('getDeviceInformation:: ', await getDeviceInformation(config.deviceId), '\n');
  console.log('getDeviceSpesification:: ', await getDeviceSpesification(config.deviceId), '\n');
  console.log('getDeviceFunctions:: ', await getDeviceFunctions(config.deviceId), '\n');
  console.log('getCategoryFunctions:: ', await getCategoryFunctions((await getDeviceFunctions(config.deviceId)).result.category), '\n');
  console.log('getCategoryList:: ', await getCategoryList(), '\n');
  console.log('getDeviceStatus:: ', await getDeviceStatus(config.deviceId), '\n');
  console.log('getDeviceStatus:: ', await getDeviceStatus(config.deviceId), '\n');
  

  
}

main().catch(err => {
  console.error(err)
  // throw Error(`error: ${err}`);
});