import { Router } from "express";

import { db } from "../../../services/mongo.ts";

const router = Router();
const collection = "audit_logs";
const prefix = `/admin/${collection}`;

// /admin/logs
router.route(prefix).get(async (_req, res) => {
  // return all logs
  const response = await db.collection(collection).find().toArray();
  res.json(response);
});

export default router;
