import { get } from "./get.js";

export async function getDeviceInformation(deviceId){
  const query = {};
  const method = 'GET';
  const url = `/v1.1/iot-03/devices/${deviceId}`;
  return get(query, method, url)
}

