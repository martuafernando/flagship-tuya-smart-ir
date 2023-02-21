import { getAllBrand, getAllRemote, getKey, sendCommand } from "./index.js"

import express, { response } from 'express'
import bodyParser from "body-parser";

const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000

app.get('/:infrared_id/brand', async (req, res) => {
  const infrared_id = req.params.infrared_id
  const query = req.query.category_id ? req.query.category_id : 5
  
  res.json(await getAllBrand(infrared_id, query))
})

app.get('/:infrared_id/remote', async (req, res) => {
  const infrared_id = req.params.infrared_id
  
  res.json(await getAllRemote(infrared_id))
})

app.get('/:infrared_id/:remote_id/key', async (req, res) => {
  const { infrared_id, remote_id } = req.params
  
  res.json(await getKey(infrared_id, remote_id))
})

app.post('/:infrared_id/:remote_id/command', async (req, res, next) => {
  const { infrared_id, remote_id } = req.params
  const { code, value } = req.body
  try {
    const response = await sendCommand(infrared_id, remote_id, code, value)
    res.json(response)
  }catch (error){
    console.error(error.message.split('||')[0])
    res.status(Number(error.message.split('||')[1]))
    res.json({
      success: false,
      message: error.message.split('||')[0]
    })
  }
})


app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
