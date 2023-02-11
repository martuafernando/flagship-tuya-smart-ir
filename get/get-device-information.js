import { getRequestSign } from '../get/get-sign.js';

export async function getDeviceInformation(httpClient, deviceId) {
  const query = {};
  const method = 'GET';
  const url = `/v1.0/devices/${deviceId}/specification`;
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