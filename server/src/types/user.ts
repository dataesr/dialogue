type userRoles = "admin" | "user";

export type userType = {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: userRoles;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
  isActive?: boolean;
};
