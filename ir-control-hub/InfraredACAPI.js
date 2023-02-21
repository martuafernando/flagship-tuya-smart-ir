import { config } from '../config.js'
import * as qs from 'qs'
import * as crypto from 'crypto'
import { encryptStr } from '../helper.js'
import { default as axios } from 'axios'

export class InfraredACAPI{

  static async init(){
    this.httpClient = axios.create({
      baseURL: config.host,
      timeout: 1000 * 1e3,
    })
    this.token = await this.getToken()
  }

  static getAirConditionerStatus(infrared_id, remote_id){
    const query = {}
    const method = 'GET'
    const url = `/v2.0/infrareds/${infrared_id}/remotes/${remote_id}/ac/status`
    return this.send(query, method, url)
  }

  static postSingleCommand({remote_index, category_id, code, value}, infrared_id){
    const query = {}
    const method = 'POST'
    const url = `/v2.0/infrareds/${infrared_id}/air-conditioners/testing/command`
    if (value){
      return this.send(query, method, url, {remote_index, category_id, code, value})
    } else {
      return this.send(query, method, url, {remote_index, category_id, code})
    }
  }

  static postControlAirConditioner({remote_index, category_id, code, value}, infrared_id, remote_id){
    const query = {}
    const method = 'POST'
    const url = `/v2.0/infrareds/${infrared_id}/air-conditioners/${remote_id}/command`
    if (value){
      return this.send(query, method, url, {remote_index, category_id, code, value})
    } else {
      return this.send(query, method, url, {remote_index, category_id, code})
    }
  }

  static async send(query = {}, method = 'GET', url = '', body = {}) {
    const reqHeaders = await this.getRequestSign(url, method, {}, query, body)

    const { status, data } = await this.httpClient.request({
      method,
      data: body,
      params: {},
      headers: reqHeaders,
      url: reqHeaders.path,
    })
  
    if (!data || !data.success) {
      throw Error(new Error(`${data.msg}||${status}`))
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