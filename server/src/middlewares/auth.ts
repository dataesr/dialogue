import type { NextFunction, Request, Response } from "express";
import type { AuthUser } from "../types/identification.ts";

// TODO: remplacer par la vérification du token SSO
const FAKE_USER: AuthUser = {
  id: "user1",
  email: "jerem@domain.com",
  name: "Jerem",
  role: "admin",
};

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  req.user = FAKE_USER;
  next();
}

export const requireRole =
  (...allowed: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!allowed.includes(req.user?.role || "")) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
