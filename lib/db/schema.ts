import { relations } from "drizzle-orm";
import {
	type AnyPgColumn,
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
	id: uuid("id").primaryKey().defaultRandom(),
	title: text("title").notNull(),
	slug: text("slug").notNull().unique(),
	body: text("body").notNull(),
	tags: text("tags").array().notNull().default([]),
	published: boolean("published").notNull().default(true),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	deletedAt: timestamp("deleted_at"),
});

export const rateLimit = pgTable("rateLimit", {
	id: text("id").primaryKey(),
	key: text("key").notNull(),
	count: integer("count").notNull(),
	lastRequest: timestamp("lastRequest").notNull(),
});

export const comments = pgTable("comments", {
	id: uuid("id").primaryKey().defaultRandom(),
	postId: uuid("post_id")
		.references(() => posts.id, { onDelete: "cascade" })
		.notNull(),
	parentId: uuid("parent_id").references((): AnyPgColumn => comments.id, {
		onDelete: "cascade",
	}),
	authorName: text("author_name").notNull(),
	body: text("body").notNull(),
	approved: boolean("approved").notNull().default(false),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	deletedAt: timestamp("deleted_at"),
});

export const postsRelations = relations(posts, ({ many }) => ({
	comments: many(comments),
}));
export const commentsRelations = relations(comments, ({ one, many }) => ({
	post: one(posts, { fields: [comments.postId], references: [posts.id] }),
	parent: one(comments, {
		fields: [comments.parentId],
		references: [comments.id],
		relationName: "parent_child",
	}),
	replies: many(comments, { relationName: "parent_child" }),
}));

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("emailVerified").notNull(),
	image: text("image"),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expiresAt").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
	ipAddress: text("ipAddress"),
	userAgent: text("userAgent"),
	userId: text("userId")
		.notNull()
		.references(() => user.id),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("accountId").notNull(),
	providerId: text("providerId").notNull(),
	userId: text("userId")
		.notNull()
		.references(() => user.id),
	accessToken: text("accessToken"),
	refreshToken: text("refreshToken"),
	idToken: text("idToken"),
	accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
	refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expiresAt").notNull(),
	createdAt: timestamp("createdAt"),
	updatedAt: timestamp("updatedAt"),
});

export const loginAttempts = pgTable("loginAttempts", {
	email: text("email").primaryKey(),
	failedCount: integer("failedCount").notNull().default(0),
	lockoutUntil: timestamp("lockoutUntil"),
});
