import { config } from '../config.js'
import * as qs from 'qs'
import * as crypto from 'crypto'
import { encryptStr } from '../helper.js'
import { default as axios } from 'axios'

export class IotCore{

  static async init(){
    this.httpClient = axios.create({
      baseURL: config.host,
      timeout: 5 * 1e3,
    })
    this.token = await this.getToken()
  }

  static getDeviceStatus(deviceId){
    const query = {}
    const method = 'GET'
    const url = `/v1.0/iot-03/devices/${deviceId}/status`
    return this.get(query, method, url)
  }

  static getDeviceSpesification(deviceId){
    const query = {}
    const method = 'GET'
    const url = `/v1.2/iot-03/devices/${deviceId}/specification`
    return this.get(query, method, url)
  }

  static getDeviceInformation(deviceId){
    const query = {}
    const method = 'GET'
    const url = `/v1.1/iot-03/devices/${deviceId}`
    return this.get(query, method, url)
  }

  static getDeviceFunctions(deviceId){
    const query = {}
    const method = 'GET'
    const url = `/v1.0/iot-03/devices/${deviceId}/functions`
    return this.get(query, method, url)
  }

  static getCategoryList(){
    const query = {}
    const method = 'GET'
    const url = `/v1.0/iot-03/device-categories`
    return this.get(query, method, url)
  }

  static getCategoryFunctions(categoryId){
    const query = {}
    const method = 'GET'
    const url = `/v1.0/iot-03/categories/${categoryId}/functions`
    return this.get(query, method, url)
  }

  static async get(query = {}, method = 'GET', url = '') {
    const reqHeaders = await this.getRequestSign(url, method, {}, query)
  
    const { data } = await this.httpClient.request({
      method,
      data: {},
      params: {},
      headers: reqHeaders,
      url: reqHeaders.path,
    })
  
    if (!data || !data.success) {
      throw Error(`request api failed: ${data.msg}`)
    }else{
      return data
    }
  }

  static async getRequestSign(
    path,
    method,
    headers = {},
    query = {},
    body = {},
  ) {
    const t = Date.now().toString()
    const [uri, pathQuery] = path.split('?')
    const queryMerged = Object.assign(query, qs.parse(pathQuery))
    const sortedQuery = {}
    Object.keys(queryMerged)
      .sort()
      .forEach((i) => (sortedQuery[i] = query[i]))
  
    const querystring = decodeURIComponent(qs.stringify(sortedQuery))
    const url = querystring ? `${uri}?${querystring}` : uri
    const contentHash = crypto.createHash('sha256').update(JSON.stringify(body)).digest('hex')
    const stringToSign = [method, contentHash, '', url].join('\n')
    const signStr = config.accessKey + this.token + t + stringToSign
    return {
      t,
      path: url,
      client_id: config.accessKey,
      sign: await encryptStr(signStr, config.secretKey),
      sign_method: 'HMAC-SHA256',
      access_token: this.token,
    }
  }

  static async getToken() {
    const method = 'GET'
    const timestamp = Date.now().toString()
    const signUrl = '/v1.0/token?grant_type=1'
    const contentHash = crypto.createHash('sha256').update('').digest('hex')
    const stringToSign = [method, contentHash, '', signUrl].join('\n')
    const signStr = config.accessKey + timestamp + stringToSign
  
    const headers = {
      t: timestamp,
      sign_method: 'HMAC-SHA256',
      client_id: config.accessKey,
      sign: await encryptStr(signStr, config.secretKey),
    }
    const { data: login } = await this.httpClient.get('/v1.0/token?grant_type=1', { headers })
    if (!login || !login.success) {
      throw Error(`fetch failed: ${login.msg}`)
    }
    return login.result.access_token
  }
}