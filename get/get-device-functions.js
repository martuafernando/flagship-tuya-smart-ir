import { get } from "./get.js";

export async function getDeviceFunctions(deviceId){
  const query = {};
  const method = 'GET';
  const url = `/v1.0/iot-03/devices/${deviceId}/functions`;
  return get(query, method, url)
}

