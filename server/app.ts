import "dotenv/config"
import express, { type Express } from "express"
import path from "path"

import router from "./src/router.ts"

const app: Express = express()

if (process.env.NODE_ENV !== "development") {
  app.use(express.static(path.join(path.resolve(), "dist")))
}
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use("/api", router)

app.listen(3000)