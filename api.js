import { getAllBrand, getAllRemote, getKey, sendCommand } from "./index.js"

import express from 'express'
const app = express()
const port = 3000

app.get('/:infrared_id/brand', async (req, res) => {
  const infrared_id = req.params.infrared_id
  const query = req.query.category_id ? req.query.category_id : 5
  
  res.json(await getAllBrand(infrared_id, query))
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
