import FeaturedBlogCarousel, {
	type BlogPost,
} from "@/components/FeaturedBlogCarousel";
import { db } from "@/lib/db";

// Async Server Component
export default async function PostsCarouselSection() {
	const rawPosts = await db.query.posts.findMany({
		orderBy: (posts, { desc }) => [desc(posts.createdAt)],
		with: { comments: true },
	});

	const posts: BlogPost[] = rawPosts.map((p) => ({
		id: p.id,
		title: p.title,
		slug: p.slug,
		excerpt: p.body.length > 80 ? `${p.body.substring(0, 80)}...` : p.body,
	}));

	return <FeaturedBlogCarousel posts={posts} />;
}
