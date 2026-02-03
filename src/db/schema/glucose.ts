import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const glucose = pgTable("glucose", {
  id: integer("id").generatedAlwaysAsIdentity(),
  timestamp: timestamp("timestamp").notNull(),
  glucose: integer("glucose").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const glucoseRelations = relations(glucose, ({ one }) => ({
  user: one(user, {
    fields: [glucose.userId],
    references: [user.id],
  }),
}));
