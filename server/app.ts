import "dotenv/config"
import express, { type Express } from "express"
import path from "path";

import { runWithContext } from "./src/services/auditContext.ts";
import { authMiddleware, requireRole } from "./src/middlewares/auth.ts";
import router from "./src/router.ts"

const app: Express = express()

app.use(express.json())
const apiRoute = "/api";
app.use(apiRoute, authMiddleware, requireRole("administrator", "reader", "contributor", "top-contributeur", "validator"));
app.use(apiRoute, (req, _res, next) => {
  runWithContext(
    {
      userId: req.user?.id,
      userEmail: req.user?.email,
    },
    next,
  );
});

app.use(apiRoute, router);

const distPath = path.resolve(import.meta.dirname, "./dist")
app.use(express.static(distPath));

app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api")) return next()
  res.sendFile(path.join(distPath, "index.html"))
})

app.listen(3000)