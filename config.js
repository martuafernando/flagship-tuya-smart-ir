import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  host: process.env.HOST,
  accessKey: process.env.ACCESS_KEY,
  secretKey: process.env.SECRET_KEY,
  deviceId: process.env.DEVICE_ID,
  token : '',
};