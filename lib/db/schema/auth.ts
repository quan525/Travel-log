import { relations } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const timestamp = (name: string) => integer(name, { mode: 'timestamp' });

export const user = sqliteTable('user', {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: integer({ mode: 'boolean' }).default(false).notNull(),
  image: text(),
  createdAt: timestamp('created_at').$default(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$default(() => new Date()).$onUpdate(() => new Date()).notNull(),
});

export const session = sqliteTable('session', {
  id: integer().primaryKey({ autoIncrement: true }),
  expiresAt: timestamp('expires_at').notNull(),
  token: text().notNull().unique(),
  createdAt: timestamp('created_at').$default(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$default(() => new Date()).$onUpdate(() => new Date()).notNull(),
  ipAddress: text(),
  userAgent: text(),
  userId: integer().notNull().references(() => user.id, { onDelete: 'cascade' }),
}, table => [index('session_userId_idx').on(table.userId)]);

export const account = sqliteTable('account', {
  id: integer().primaryKey({ autoIncrement: true }),
  accountId: text().notNull(),
  providerId: text().notNull(),
  userId: integer('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text(),
  password: text(),
  createdAt: timestamp('created_at').$default(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$default(() => new Date()).$onUpdate(() => new Date()).notNull(),
}, table => [index('account_userId_idx').on(table.userId)]);

export const verification = sqliteTable('verification', {
  id: integer().primaryKey({ autoIncrement: true }),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').$default(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$default(() => new Date()).$onUpdate(() => new Date()).notNull(),
}, table => [index('verification_identifier_idx').on(table.identifier)]);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
