export type AuthUser = {
  email?: string
  id: string
  name?: string
  role: string
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}