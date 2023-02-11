import { get } from "./get.js";

export async function getCategoryList(){
  const query = {};
  const method = 'GET';
  const url = `/v1.0/iot-03/device-categories`;
  return get(query, method, url)
}

