import { config } from '../config.js'
import * as qs from 'qs'
import * as crypto from 'crypto'
import { encryptStr } from '../helper.js'
import { default as axios } from 'axios'

export class InfraredCommonAPI{

  static async init(){
    this.httpClient = axios.create({
      baseURL: config.host,
      timeout: 1000 * 1e3,
    })
    this.token = await this.getToken()
  }

  static getRemoteControlList(infrared_id){
    const query = {}
    const method = 'GET'
    const url = `/v2.0/infrareds/${infrared_id}/remotes`
    return this.send(query, method, url)
  }

  static getCategoryList(infrared_id){
    const query = {}
    const method = 'GET'
    const url = `/v2.0/infrareds/${infrared_id}/categories`
    return this.send(query, method, url)
  }

  static getBrandList(infrared_id, category_id, countryCode = 'ID'){
    const query = { countryCode }
    const method = 'GET'
    const url = `/v2.0/infrareds/${infrared_id}/categories/${category_id}/brands`
    return this.send(query, method, url)
  }

  static getKeysOfRemoteControl(infrared_id, remote_id){
    const query = {}
    const method = 'GET'
    const url = `/v2.0/infrareds/${infrared_id}/remotes/${remote_id}/keys`
    return this.send(query, method, url)
  }

  static getRemoteControlIndexes(infrared_id, category_id, brand_id){
    const query = {}
    const method = 'GET'
    const url = `/v2.0/infrareds/${infrared_id}/categories/${category_id}/brands/${brand_id}/remote-indexs`
    return this.send(query, method, url)
  }

  static getInfraredCodeLibraryInformation({infrared_id, category_id, brand_id, remote_index}){
    const query = {}
    const method = 'GET'
    const url = `/v2.0/infrareds/${infrared_id}/categories/${category_id}/brands/${brand_id}/remotes/${remote_index}/rules`
    return this.send(query, method, url)
  }

  static postKeyCommand({remote_index, category_id, key_id, key}, infrared_id, remote_id){
    const query = {}
    const method = 'POST'
    const url = `/v2.0/infrareds/${infrared_id}/remotes/${remote_id}/raw/command`

    return this.send(query, method, url, {remote_index, category_id, key_id, key})
  }

  static postStandardCommand({category_id, key, remote_index}, infrared_id, remote_id){
    const query = {}
    const method = 'POST'
    const url = `/v2.0/infrareds/${infrared_id}/remotes/${remote_id}/command`
    
    return this.send(query, method, url, {category_id, key, remote_index})
  }

  static async send(query = {}, method = 'GET', url = '', body = {}) {
    const reqHeaders = await this.getRequestSign(url, method, {}, query, body)
  
    const { data } = await this.httpClient.request({
      method,
      data: body,
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