import { IotCore } from './iot-core/IotCore.js'
import { config } from './config.js'
import { InfraredCommonAPI } from './ir-control-hub/InfraredCommonAPI.js'
import { InfraredACAPI } from './ir-control-hub/InfraredACAPI.js'

async function main() {
  await InfraredCommonAPI.init()
  await InfraredACAPI.init()

  const {remote_index, remote_id, category_id} = (await InfraredCommonAPI.getRemoteControlList(config.deviceId)).result[0]
  console.log({remote_index, remote_id, category_id})
  const keysOfRemoteContorl = (await InfraredCommonAPI.getKeysOfRemoteControl(config.deviceId, remote_id)).result
  const key = keysOfRemoteContorl.key_list
  console.log(key)

  // Trying turn ON AC
  // console.log(await InfraredCommonAPI.postStandardCommand({remote_index, category_id, key: 'PowerOn'}, config.deviceId, remote_id))
  console.log(await InfraredCommonAPI.postStandardCommand({remote_index, category_id, key: 'PowerOff'}, config.deviceId, remote_id))
  

  // console.log(await InfraredACAPI.getAirConditionerStatus(config.deviceId, remote_id))

  // await InfraredACAPI.postSingleCommand({remote_index, category_id, code: 'temp', value: 26}, config.deviceId)

  // console.log(await IotCore.getDeviceInformation(config.deviceId))

  // console.log((await InfraredCommonAPI.getRemoteControlIndexes(config.deviceId, 1, 1077)).result.remote_index_list)
  

  // console.log((await InfraredCommonAPI.getKeysOfRemoteControl(
  //   config.deviceId,
  //   (await InfraredCommonAPI.getRemoteControlList(config.deviceId)).result[0].remote_id
  // )).result.key_list)

  // console.log(await InfraredCommonAPI.postKeyCommand(
  //   {
  //     "remote_index": 919,
  //     "category_id": 1,
  //     "key_id": 51,
  //     "key": "Volume-"
  //   },
  //   config.deviceId,
  //   (await InfraredCommonAPI.getRemoteControlList(config.deviceId)).result[0].remote_id
  // ))
}

main().catch(err => {
  console.error(err)
  // throw Error(`error: ${err}`);
});