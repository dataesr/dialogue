type userRoles = "admin" | "user";

export type userType = {
  _id?: string;
  createdAt?: Date;
  email: string;
  firstName: string;
  isActive?: boolean;
  lastLogin?: Date;
  lastName: string;
  role?: userRoles;
  updatedAt?: Date;
};
