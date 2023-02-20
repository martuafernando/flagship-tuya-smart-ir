import { IotCore } from './iot-core/IotCore.js'
import { InfraredCommonAPI } from './ir-control-hub/InfraredCommonAPI.js'
import { InfraredACAPI } from './ir-control-hub/InfraredACAPI.js'

async function main() {
  await InfraredCommonAPI.init()
  await InfraredACAPI.init()

  async function init(infrared_id) {
    const {remote_index, remote_id, category_id} = (await InfraredCommonAPI.getRemoteControlList(infrared_id)).result[0]
    console.log({remote_index, remote_id, category_id})
    return {remote_index, remote_id, category_id}
  }

  async function getAllBrand(infrared_id) {
    const { category_id } = await init(infrared_id)
    return (await InfraredCommonAPI.getBrandList(infrared_id, category_id)).result
  }

  async function getAllRemote(infrared_id) {
    return (await InfraredCommonAPI.getRemoteControlList(infrared_id)).result
  }

  async function getKey(infrared_id, remote_id) {
    const { key_list, key_range } = (await InfraredCommonAPI.getKeysOfRemoteControl(infrared_id, remote_id)).result
    return [ ...key_list, ...key_range ]
  }

  async function power (infrared_id, remote_id, isOn) {
    const { remote_index, category_id } = await init(infrared_id)
    if (isOn) {
      return (await InfraredCommonAPI.postStandardCommand({remote_index, category_id, key: 'PowerOn'}, infrared_id, remote_id)).result
    }
    return (await InfraredCommonAPI.postStandardCommand({remote_index, category_id, key: 'PowerOff'}, infrared_id, remote_id)).result
  }

  async function sendCommand(infrared_id, remote_id, code, value) {
    const { remote_index, category_id } = await init(infrared_id)
    return (await InfraredACAPI.postControlAirConditioner({remote_index, category_id, code, value}, infrared_id, remote_id)).result
  }

  console.log(await sendCommand('002102102cf432241bcb', 'ebe5d64f8a2fddb45ddkz8', 'wind', 3))
}

main().catch(err => {
  console.error(err)
  throw Error(`error: ${err}`);
})