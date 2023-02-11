import { getRequestSign } from './get-sign.js';
import { config } from '../config.js';

export async function get(query = {}, method = 'GET', url = '') {
  const reqHeaders = await getRequestSign(url, method, {}, query);

  const { data } = await config.httpClient.request({
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