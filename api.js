import { getAllBrand, getAllRemote, getKey, getStatus, sendCommand } from "./index.js"

import express, { response } from 'express'
import bodyParser from "body-parser";

const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000

app.get('/:infrared_id/brand', async (req, res) => {
  const infrared_id = req.params.infrared_id
  const query = req.query.category_id ? req.query.category_id : 5
  res.json(await getAllBrand(infrared_id, query))

  console.log(`SUCCESS GET /${infrared_id}/brand`)
})

app.get('/:infrared_id/:remote_id/status', async (req, res) => {
  const { infrared_id, remote_id } = req.params
  res.json(await getStatus(infrared_id, remote_id))

  console.log(`SUCCESS GET /${infrared_id}/brand`)
})

app.get('/:infrared_id/remote', async (req, res) => {
  const infrared_id = req.params.infrared_id
  res.json(await getAllRemote(infrared_id))

  console.log(`SUCCESS GET /${infrared_id}/remote`)
})

app.get('/:infrared_id/:remote_id/key', async (req, res) => {
  const { infrared_id, remote_id } = req.params
  res.json(await getKey(infrared_id, remote_id))

  console.log(`SUCCESS GET /${infrared_id}/${remote_id}/key`)
})

app.post('/:infrared_id/:remote_id/command', async (req, res, next) => {
  const { infrared_id, remote_id } = req.params
  const { code, value } = req.body
  console.log(req.body)
  try {
    const response = await sendCommand(infrared_id, remote_id, code, value)
    res.json(response)

    console.log(`SUCCESS GET /${infrared_id}/${remote_id}/command`)
  }catch (error){
    res.status(Number(error.message.split('||')[1]))
    res.json({
      success: false,
      message: error.message
    })

    console.log(`ERROR GET /${infrared_id}/${remote_id}/command`)
    console.error(error)
  }
})


app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
