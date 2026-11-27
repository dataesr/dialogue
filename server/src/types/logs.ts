import type { ObjectId } from "mongodb";

export type LogType = "create" | "update" | "delete";

export interface LogChange {
  field: string;
  from: unknown;
  to: unknown;
}

export interface Log {
  _id: ObjectId;
  action: LogType;
  changes: LogChange[];
  collection: string;
  documentId: ObjectId;
  timestamp: Date;
  user: string;
}
