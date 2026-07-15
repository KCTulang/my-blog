import { eq } from "drizzle-orm";
import { auth } from "../auth";
import { db } from "./index";
import { comments, posts, user } from "./schema";

async function main() {
	console.log("Seeding database...");

	try {
		const existingAdmin = await db.query.user.findFirst({
			where: eq(user.email, "admin@loonary.com"),
		});

		if (!existingAdmin) {
			console.log("Seeding Admin User...");
			const password = process.env.ADMIN_PASSWORD || "LoonaryAdmin888";
			await auth.api.signUpEmail({
				body: {
					email: "admin@loonary.com",
					password: password,
					name: "Admin",
				},
			});
			console.log("Admin User seeded successfully.");
		} else {
			console.log("Admin User already exists. Skipping.");
		}

		const insertedPosts = await db
			.insert(posts)
			.values([
				{
					title: "Welcome to Loonary",
					slug: "welcome-to-loonary-final",
					body: "This is the very first post on my new moonlit digital diary. Inspired by my dog Loona, and built for sharing stories.",
					tags: ["personal", "intro"],
				},
				{
					title: "The Phases of the Moon",
					slug: "phases-of-the-moon",
					body: "Just like the moon, we go through phases. Today I want to write about embracing change and the beauty of starting over.",
					tags: ["personal", "reflection"],
				},
				{
					title: "Building a Full-Stack Blog",
					slug: "building-full-stack-blog",
					body: "This week I started a 10-day sprint to build this very blog using Next.js, Neon Postgres, and Drizzle ORM!",
					tags: ["tech", "nextjs"],
				},
			])
			.onConflictDoNothing()
			.returning();

		console.log(
			`${insertedPosts.length} post(s) inserted (skipped duplicates).`,
		);

		if (insertedPosts.length > 0) {
			await db
				.insert(comments)
				.values([
					{
						postId: insertedPosts[0].id,
						authorName: "Admin",
						body: "Testing the brand new comments section!",
						approved: true,
					},
					{
						postId: insertedPosts[2].id,
						authorName: "Next.js Fan",
						body: "Good luck on your 10-day sprint!",
						approved: true,
					},
				])
				.onConflictDoNothing();

			console.log("Seed comments inserted.");
		}

		console.log("Database seeding complete!");
		process.exit(0);
	} catch (error) {
		console.error("Error seeding database:", error);
		process.exit(1);
	}
}

main();
