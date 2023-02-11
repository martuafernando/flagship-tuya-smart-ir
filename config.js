import * as dotenv from 'dotenv';
import { default as axios } from 'axios';

dotenv.config();

export const config = {
  host: process.env.HOST,
  accessKey: process.env.ACCESS_KEY,
  secretKey: process.env.SECRET_KEY,
  deviceId: process.env.DEVICE_ID,
  token : '',

  httpClient: axios.create({
    baseURL: process.env.HOST,
    timeout: 5 * 1e3,
  })
};