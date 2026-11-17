type UserRoleType = "admin" | "user"

export type UserType = {
  _id?: string
  createdAt?: Date
  email: string
  firstName: string
  isActive?: boolean
  lastLogin?: Date
  lastName: string
  role?: UserRoleType
  updatedAt?: Date
};
