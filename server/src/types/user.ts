import { ObjectId } from "mongodb"

type UserRoleType = "admin" | "user"

export type UserType = {
  _id?: ObjectId
  createdAt?: Date
  email: string
  firstName: string
  isActive?: boolean
  lastLogin?: Date
  lastName: string
  role?: UserRoleType
  updatedAt?: Date
};
