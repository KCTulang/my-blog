import { relations } from "drizzle-orm";
import {
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

export const authAttempts = pgTable("auth_attempts", {
	ip: text("ip").primaryKey(),
	attempts: integer("attempts").notNull().default(0),
	lockoutUntil: timestamp("lockout_until"),
	lastAttemptAt: timestamp("last_attempt_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
	id: uuid("id").primaryKey().defaultRandom(),
	postId: uuid("post_id")
		.references(() => posts.id, { onDelete: "cascade" })
		.notNull(),
	authorName: text("author_name").notNull(),
	body: text("body").notNull(),
	approved: boolean("approved").notNull().default(false),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	deletedAt: timestamp("deleted_at"),
});

export const postsRelations = relations(posts, ({ many }) => ({
	comments: many(comments),
}));
export const commentsRelations = relations(comments, ({ one }) => ({
	post: one(posts, { fields: [comments.postId], references: [posts.id] }),
}));
