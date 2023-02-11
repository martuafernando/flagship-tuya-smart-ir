import { get } from "./get.js";

export async function getDeviceSpesification(deviceId){
  const query = {};
  const method = 'GET';
  const url = `/v1.2/iot-03/devices/${deviceId}/specification`;
  return get(query, method, url)
}

