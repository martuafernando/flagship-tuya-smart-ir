import { get } from "./get.js";

export async function getDeviceStatus(deviceId){
  const query = {};
  const method = 'GET';
  const url = `/v1.0/iot-03/devices/${deviceId}/status`;
  return get(query, method, url)
}

