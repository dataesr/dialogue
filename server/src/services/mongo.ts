import { MongoClient } from "mongodb"

import logger from "./logger.ts"

const mongoDbName = process.env.MONGO_DB_NAME || "dialogue-staging"
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/"
const client = new MongoClient(mongoUri)

logger.info(`Try to connect to mongo Dialogue...`)
await client.connect().catch((error) => {
  logger.info(`Connexion to mongo Dialogue instance failed... Terminating... ${error.message}`)
  process.kill(process.pid, "SIGTERM")
})

logger.info("Connected to mongo database - Dialogue...")
const db = client.db(mongoDbName)

export { client, db }