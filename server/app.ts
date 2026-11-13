import "dotenv/config"
import express, { type Express } from "express"
import path from "path"

import router from "./src/router.ts"

const app: Express = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api", router)

const distPath = path.resolve(import.meta.dirname, "./dist")
app.use(express.static(distPath));

app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api")) return next()
  res.sendFile(path.join(distPath, "index.html"))
})

app.listen(3000)