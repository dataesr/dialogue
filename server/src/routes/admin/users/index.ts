import { Router } from "express";

import { db } from "../../../services/mongo.ts";
import type { userType } from "../../../types/user.ts";

const router = Router();
const dbCollection = "users";

// /admin/users
router
  .route(`/${dbCollection}`)
  .get(async (_, res) => {
    const response = await db.collection(dbCollection).find({}).toArray();
    res.json(response);
  })
  .post(async (req, res) => {
    const user: Omit<userType, "_id"> = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      createdAt: new Date(),
      role: "user",
      isActive: true,
    };
    const response = await db.collection(dbCollection).insertOne(user);
    res.json({
      message: "User successfully added",
      userId: response.insertedId,
    });
  });

export default router;
