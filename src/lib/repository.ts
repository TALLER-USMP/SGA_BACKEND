import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../drizzle/schema";
import { getDb } from "../db";

export abstract class BaseRepository {
  protected db: NodePgDatabase<typeof schema>;
  constructor() {
    const database = getDb();
    this.db = database as unknown as NodePgDatabase<typeof schema>;
  }
}
