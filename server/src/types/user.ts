import { ObjectId } from "mongodb"

type UserRole = "admin" | "user"

export interface User {
  _id: ObjectId
  email: string
  firstName: string
  isActive?: boolean
  lastLoginAt?: Date
  lastName: string
  modifiedAt: Date
  modifiedBy: string
  role?: UserRole
}

export type UserNew = Omit<User, '_id' | 'modifiedBy' | 'modifiedAt'>
