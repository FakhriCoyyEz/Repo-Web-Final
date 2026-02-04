import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// Better Auth tables with admin plugin support
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  image: text("image"),
  role: text("role").default("user"), // Admin plugin: 'user' or 'admin'
  banned: integer("banned", { mode: "boolean" }).default(false), // Admin plugin: ban status
  banReason: text("ban_reason"), // Admin plugin: reason for ban
  banExpires: integer("ban_expires", { mode: "timestamp" }), // Admin plugin: ban expiration
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const userRelations = relations(user, ({ many }) => ({
  news: many(news),
}));

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"), // Admin plugin: tracks admin impersonation
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Custom Tables

export const gallery = sqliteTable("gallery", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // image, video, text, html, txt
  url: text("url"), // R2 URL for files
  content: text("content"), // Text content for text/html types
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const galleryRelations = relations(gallery, ({ many }) => ({
  comments: many(comments),
}));

export const news = sqliteTable("news", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(), // HTML content
  mediaUrl: text("media_url"), // Main image/video
  mediaType: text("media_type"), // image, video
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  authorId: text("author_id").references(() => user.id),
});

export const newsRelations = relations(news, ({ one, many }) => ({
  author: one(user, {
    fields: [news.authorId],
    references: [user.id],
  }),
  comments: many(comments),
}));

export const comments = sqliteTable("comments", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  newsId: text("news_id").references(() => news.id, { onDelete: "cascade" }),
  galleryId: text("gallery_id").references(() => gallery.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(), // Simple name for public comments
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const commentsRelations = relations(comments, ({ one }) => ({
  news: one(news, {
    fields: [comments.newsId],
    references: [news.id],
  }),
  gallery: one(gallery, {
    fields: [comments.galleryId],
    references: [gallery.id],
  }),
}));

export const globalContent = sqliteTable("global_content", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(), // e.g., 'home_hero_title', 'contact_email'
  value: text("value").notNull(),
  type: text("type").default("text"), // text, image, rich_text
  description: text("description"), // Helper text for admin
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

