import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const Guestbook = pgTable('guestbook', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  message: text('message').notNull(),
  website: text('website'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
