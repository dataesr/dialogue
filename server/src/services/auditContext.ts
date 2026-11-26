import { AsyncLocalStorage } from "node:async_hooks"

export type AuditContext = { ip?: string; requestId?: string; userEmail?: string; userId?: string }

const storage = new AsyncLocalStorage<AuditContext>()

export const runWithContext = (store: AuditContext, fn: () => void) => storage.run(store, fn)
export const getContext = (): AuditContext => storage.getStore() ?? {}