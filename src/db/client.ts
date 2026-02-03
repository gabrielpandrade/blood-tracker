import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/db/schema";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) throw new Error("Invalid DATABASE_URL");

export const db = drizzle(DATABASE_URL, {
  schema: schema,
});
