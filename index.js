import { InfraredCommonAPI } from './ir-control-hub/InfraredCommonAPI.js'
import { InfraredACAPI } from './ir-control-hub/InfraredACAPI.js'

  
async function init(infrared_id, remote_id) {
  await InfraredCommonAPI.init()
  const allRemote = (await InfraredCommonAPI.getRemoteControlList(infrared_id)).result
  const remote = allRemote.filter((it) => it.remote_id === remote_id)[0]

  return remote
}

async function getAllBrand(infrared_id, category_id = 5) {
  await InfraredCommonAPI.init()
  const response = await InfraredCommonAPI.getBrandList(infrared_id, category_id)
  return {
    success: response.success,
    data: response.result,
  }
}

async function getAllRemote(infrared_id) {
  await InfraredCommonAPI.init()
  const response = await InfraredCommonAPI.getRemoteControlList(infrared_id)
  return {
    success: response.success,
    data: response.result
  }
}

async function getKey(infrared_id, remote_id) {
  await InfraredCommonAPI.init()
  const response = await InfraredCommonAPI.getKeysOfRemoteControl(infrared_id, remote_id)
  return {
    success: response.success,
    data: {
      key_list: response.result.key_list,
      key_range: response.result.key_range,
    }
  }
}

async function getStatus(infrared_id, remote_id) {
  await InfraredACAPI.init()
  const response = await InfraredACAPI.getAirConditionerStatus(infrared_id, remote_id)
  return {
    success: response.success,
    data: response.result
  }
}



async function sendCommand(infrared_id, remote_id, code, value) {
  await InfraredACAPI.init()
  const { remote_index, category_id } = await init(infrared_id, remote_id)
  const response = await InfraredACAPI.postControlAirConditioner({ remote_index, category_id, code, value }, infrared_id, remote_id)
  return {
    success: response.success,
    data: response.result,
  }
}

export { getAllBrand, getAllRemote, getKey, sendCommand, getStatus }