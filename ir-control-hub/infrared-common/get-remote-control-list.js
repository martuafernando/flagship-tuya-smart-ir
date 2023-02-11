import { get } from "./get.js";

export async function getRemoteControlList(categoryId){
  const query = {};
  const method = 'GET';
  const url = `/v1.0/iot-03/categories/${categoryId}/functions`;
  return get(query, method, url)
}

