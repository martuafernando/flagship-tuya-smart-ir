import { InfraredCommonAPI } from './ir-control-hub/InfraredCommonAPI.js'
import { InfraredACAPI } from './ir-control-hub/InfraredACAPI.js'

async function main() {
  await InfraredCommonAPI.init()
  await InfraredACAPI.init()

  async function init(infrared_id, remote_id) {
    const allRemote = (await InfraredCommonAPI.getRemoteControlList(infrared_id)).result
    const remote = allRemote.filter((it) => it.remote_id === remote_id)[0]

    return remote
  }

  async function getAllBrand(infrared_id, category_id = 5) {
    const response = await InfraredCommonAPI.getBrandList(infrared_id, category_id)
    return {
      success: response.success,
      data: response.result,
    }
  }

  async function getAllRemote(infrared_id) {
    const response = await InfraredCommonAPI.getRemoteControlList(infrared_id)
    return {
      success: response.success,
      data: response.result
    }
  }

  async function getKey(infrared_id, remote_id) {
    const response = await InfraredCommonAPI.getKeysOfRemoteControl(infrared_id, remote_id)
    return {
      success: response.success,
      data: {
        key_list: response.result.key_list,
        key_range: response.result.key_range,
      }
    }
  }

  async function sendCommand(infrared_id, remote_id, code, value) {
    const { remote_index, category_id } = await init(infrared_id, remote_id)
    const response = await InfraredACAPI.postControlAirConditioner({ remote_index, category_id, code, value }, infrared_id, remote_id)
    return {
      success: response.success,
      data: response.result,
    }
  }

  // console.log(await getAllRemote('002102102cf432241bcb', 5))
  console.log(await sendCommand('002102102cf432241bcb', 'ebe5d64f8a2fddb45ddkz8', 'wind', 3))
}

main().catch(err => {
  console.error(err)
  // throw Error(`error: ${err}`);
})