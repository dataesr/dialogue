import { ObjectId } from "mongodb"

type UserRoleType = "admin" | "user"

export interface UserType {
  _id: ObjectId;
  email: string;
  firstName: string;
  isActive?: boolean;
  lastLoginAt?: Date;
  lastName: string;
  role?: UserRoleType;
  modifiedBy: string;
  modifiedAt: Date;
}

export type UserNewType = Omit<UserType, '_id' | 'modifiedBy' | 'modifiedAt'>
