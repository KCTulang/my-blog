import { db } from "./index";
import { comments, posts } from "./schema";

async function main() {
	console.log("Seeding database...");

	try {
		const insertedPost = await db
			.insert(posts)
			.values({
				title: "Welcome to Loonary",
				slug: "welcome-to-loonary",
				body: "This is the very first post on my new moonlit digital diary. Inspired by my dog Loona, and built for sharing stories.",
			})
			.returning();

		console.log("Post created successfully!");

		await db.insert(comments).values({
			postId: insertedPost[0].id,
			authorName: "Admin",
			body: "Testing the brand new comments section!",
		});

		console.log("Comment created successfully!");
		console.log("Database seeding complete!");
		process.exit(0);
	} catch (error) {
		console.error("Error seeding database:", error);
		process.exit(1);
	}
}

main();
