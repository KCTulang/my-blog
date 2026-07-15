import FeaturedBlogCarousel, {
	type BlogPost,
} from "@/components/FeaturedBlogCarousel";
import { db } from "@/lib/db";

// Async Server Component
export default async function PostsCarouselSection() {
	const rawPosts = await db.query.posts
		.findMany({
			where: (posts, { eq }) => eq(posts.published, true),
			orderBy: (posts, { desc }) => [desc(posts.createdAt)],
			with: { comments: true },
		})
		.catch(() => []);

	const posts: BlogPost[] = rawPosts.map((p) => {
		const plainText = p.body.replace(/<[^>]*>?/gm, "");
		return {
			id: p.id,
			title: p.title,
			slug: p.slug,
			excerpt:
				plainText.length > 80 ? `${plainText.substring(0, 80)}...` : plainText,
		};
	});

	return <FeaturedBlogCarousel posts={posts} />;
}
