import { isDeepStrictEqual } from "node:util";
import type { Document, Filter, UpdateFilter } from "mongodb";
import { client, db } from "./mongo.ts";
import { getContext } from "./auditContext.ts";

function diff(before: Document = {}, after: Document = {}) {
  const changes: { field: string; from: unknown; to: unknown }[] = [];
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  for (const field of keys) {
    if (!isDeepStrictEqual(before[field], after[field])) {
      changes.push({
        field,
        from: before[field],
        to: after[field],
      });
    }
  }
  return changes;
}

export function auditedCollection(name: string) {
  const collection = db.collection(name);
  const audit = db.collection("audit_logs");
  const auditError = db.collection("errors_logs");

  const entry = (action: string, documentId: unknown, changes: unknown[], userId: string) => {
    return {
      action,
      changes,
      collection: name,
      documentId,
      timestamp: new Date(),
      user: userId ?? "system",
    };
  };

  // Écriture + audit dans une seule transaction : les deux réussissent, ou aucune action
  async function withTransaction<T>(fn: (session: import("mongodb").ClientSession) => Promise<T>) {
    const session = client.startSession();
    try {
      let result!: Awaited<T>;
      await session.withTransaction(async () => {
        result = await fn(session);
      });
      return result;
    } catch (e) {
      await auditError.insertOne({ error: e });
    } finally {
      await session.endSession();
    }
  }

  return {
    insertOne: (doc: Document) => {
      withTransaction(async (session) => {
        const { userId } = getContext();
        const toInsert = { ...doc, modifiedAt: new Date(), modifiedBy: userId ?? "system" };
        const res = await collection.insertOne(toInsert, { session }); // insert dans la collection cible
        await audit.insertOne(entry("create", res.insertedId, diff({}, toInsert), userId ?? "system"), { session }); // insert dans la collection d'audit
        return res;
      }).catch(console.error);
    },

    updateOne: (filter: Filter<Document>, update: UpdateFilter<Document>) =>
      withTransaction(async (session) => {
        const before = await collection.findOne(filter, { session });
        if (!before) return null;

        const { userId } = getContext();

        // Ajout des infos de mise à jour
        await collection.updateOne({ _id: before._id }, { ...update, $set: { ...update.$set, updatedAt: new Date(), updatedBy: userId } }, { session });
        const after = await collection.findOne({ _id: before._id }, { session });

        // audit des changements
        const changes = diff(before, after ?? {});
        if (changes.length) {
          await audit.insertOne(entry("update", before._id, changes, userId ?? "system"), { session });
        }
        return after;
      }),

    deleteOne: (filter: Filter<Document>) =>
      withTransaction(async (session) => {
        const before = await collection.findOne(filter, { session });
        if (!before) return null;

        const { userId } = getContext();

        // Suppression du doc
        await collection.deleteOne({ _id: before._id }, { session });
        // audit de la suppression
        await audit.insertOne(entry("delete", before._id, diff(before, {}), userId ?? "system"), { session });
        return before;
      }),
  };
}
