import { IotCore } from './iot-core/IotCore.js'
import { config } from './config.js'

async function main() {
  await IotCore.init()
  console.log(await IotCore.getDeviceSpesification(config.deviceId))

  
}

main().catch(err => {
  console.error(err)
  throw Error(`error: ${err}`);
});