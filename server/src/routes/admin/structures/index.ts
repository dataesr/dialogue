import { Router } from "express"

import { db } from "../../../services/mongo.ts"

const { PAYSAGE_API_KEY, PAYSAGE_API_URL } = process.env

const router = Router()
const collection = "structures"
const prefix = `/admin/${collection}`
const perPage = 1000

// /admin/structures
router
  .route(prefix)
  .get(async (_req, res) => {
    const response = await db.collection(collection).find().toArray()
    res.json(response)
  })
  // It tooks 30"
  .post(async (_req, res) => {
    await db.collection(collection).deleteMany()
    const actions = []
    let condition = true
    let start = 0
    while (condition) {
      const response = await fetch(`${PAYSAGE_API_URL}/autocomplete?types=structures&query=&limit=${perPage}&start=${start}`, {
        headers: { "X-API-KEY": PAYSAGE_API_KEY },
      })
      const structures = await response.json()
      actions.push((structures?.data ?? []).map((structure) => ({
        insertOne: {
          document: {
            name: structure?.name ?? structure?.nameEn,
            paysageId: structure.id,
            shortName: structure?.shortName ?? structure?.acronymLocal ?? structure?.acronymFr ?? structure?.acronymEn,
          }
        }
      })))
      start += perPage
      // TODO, Limitation from ES to 10000. Should use the dump instead ?
      if (structures.length < perPage || start > 50000) condition = false
    }
    const actionsResponse = await db.collection(collection).bulkWrite(actions.flat(), { ordered: false })
    res.json(actionsResponse)
  })

export default router