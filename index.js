import { IotCore } from './iot-core/IotCore.js'
import { config } from './config.js'
import { InfraredCommonAPI } from './ir-control-hub/InfraredCommonAPI.js'

async function main() {
  await IotCore.init()
  await InfraredCommonAPI.init()


  console.log(await IotCore.getDeviceInformation(config.deviceId))

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