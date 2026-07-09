import { db } from "./index";
import { comments, posts } from "./schema";

async function main() {
	console.log("Seeding database...");

	try {
		const insertedPosts = await db
			.insert(posts)
			.values([
				{
					title: "Welcome to Loonary",
					slug: "welcome-to-loonary-final",
					body: "This is the very first post on my new moonlit digital diary. Inspired by my dog Loona, and built for sharing stories.",
				},
				{
					title: "The Phases of the Moon",
					slug: "phases-of-the-moon",
					body: "Just like the moon, we go through phases. Today I want to write about embracing change and the beauty of starting over.",
				},
				{
					title: "Building a Full-Stack Blog",
					slug: "building-full-stack-blog",
					body: "This week I started a 10-day sprint to build this very blog using Next.js, Neon Postgres, and Drizzle ORM!",
				},
			])
			.returning();

		console.log("3 Posts created successfully!");

		await db.insert(comments).values([
			{
				postId: insertedPosts[0].id,
				authorName: "Admin",
				body: "Testing the brand new comments section!",
			},
			{
				postId: insertedPosts[2].id,
				authorName: "Next.js Fan",
				body: "Good luck on your 10-day sprint!",
			},
		]);

		console.log("Comments created successfully!");
		console.log("Database seeding complete!");
		process.exit(0);
	} catch (error) {
		console.error("Error seeding database:", error);
		process.exit(1);
	}
}

main();
