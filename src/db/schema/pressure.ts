import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const pressure = pgTable("pressure", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  timestamp: timestamp("timestamp").notNull(),
  systolic: integer("systolic").notNull(),
  diastolic: integer("diastolic").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const pressureRelations = relations(pressure, ({ one }) => ({
  user: one(user, {
    fields: [pressure.userId],
    references: [user.id],
  }),
}));
