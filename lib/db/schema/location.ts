import { int, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { user } from './auth'

export const location = sqliteTable('locations', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  slug: text().notNull().unique(),
  userId: int().notNull().references(() => user.id),
  description: text(),
  lat: real().notNull(),
  long: real().notNull(),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
})
