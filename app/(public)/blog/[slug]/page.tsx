import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import CommentForm from "@/components/CommentForm";
import PostCardsLayout from "@/components/PostCardsLayout";
import UserCommentList from "@/components/UserCommentList";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";

async function CommentList({ postId, slug }: { postId: string; slug: string }) {
	const post = await db.query.posts
		.findFirst({
			where: (p, { eq }) => eq(p.id, postId),
			with: {
				comments: {
					where: (c, { and, eq, isNull }) =>
						and(eq(c.approved, true), isNull(c.deletedAt)),
					orderBy: (c, { asc }) => [asc(c.createdAt)],
				},
			},
		})
		.catch(() => null);

	const comments = post?.comments ?? [];

	return <UserCommentList comments={comments} postId={postId} slug={slug} />;
}

interface PostPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({
	params,
}: PostPageProps): Promise<Metadata> {
	const { slug } = await params;
	const post = await db.query.posts
		.findFirst({
			where: (p, { and, eq, isNull }) =>
				and(eq(p.slug, slug), isNull(p.deletedAt)),
		})
		.catch(() => null);

	if (!post) {
		return {
			title: "Post Not Found",
		};
	}

	const plainTextBody = post.body
		.replace(/<[^>]+>/g, "")
		.substring(0, 160)
		.trim();

	return {
		title: post.title,
		description:
			plainTextBody.length > 0
				? `${plainTextBody}...`
				: `Read ${post.title} on Loonary.`,
		openGraph: {
			title: post.title,
			description:
				plainTextBody.length > 0
					? `${plainTextBody}...`
					: `Read ${post.title} on Loonary.`,
			type: "article",
			publishedTime: post.createdAt.toISOString(),
		},
	};
}

export default async function PostPage({ params }: PostPageProps) {
	const { slug } = await params;

	const post = await db.query.posts
		.findFirst({
			where: (p, { and, eq, isNull }) =>
				and(eq(p.slug, slug), isNull(p.deletedAt)),
		})
		.catch(() => null);

	if (!post) {
		notFound();
	}

	if (!post.published) {
		const session = await verifySession();
		if (!session) {
			notFound();
		}
	}

	const recentPosts = await db.query.posts
		.findMany({
			where: (p, { eq, isNull, and, ne }) =>
				and(eq(p.published, true), isNull(p.deletedAt), ne(p.id, post.id)),
			orderBy: (p, { desc }) => [desc(p.createdAt)],
			limit: 10,
		})
		.catch(() => []);

	return (
		<div className="relative flex flex-1 flex-col">
			<div
				aria-hidden="true"
				className="ambient-glow-post pointer-events-none absolute inset-0 z-0"
			/>

			<main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 pb-20 pt-24 sm:px-6 sm:pt-28 lg:px-8">
				<Link
					href="/blog"
					className="-ml-1 mb-8 inline-flex min-h-11 items-center gap-1 text-sm text-zinc-400 transition-colors duration-200 hover:text-white"
				>
					← All stories
				</Link>

				<PostCardsLayout
					post={post}
					commentsNode={
						<Suspense
							fallback={
								<div className="h-20 w-full animate-pulse rounded bg-white/5" />
							}
						>
							<CommentList postId={post.id} slug={post.slug} />
						</Suspense>
					}
					commentFormNode={<CommentForm postId={post.id} slug={post.slug} />}
					morePostsNode={
						<ul className="flex flex-col gap-4">
							{recentPosts.length === 0 ? (
								<li className="text-sm text-zinc-500 italic">
									No other posts found.
								</li>
							) : (
								recentPosts.map((rp) => (
									<li key={rp.id}>
										<Link
											href={`/blog/${rp.slug}`}
											className="block text-sm font-light text-zinc-400 hover:text-white group-[.light-cards]:text-zinc-500 group-[.light-cards]:hover:text-zinc-800 transition-colors"
										>
											{rp.title}
										</Link>
									</li>
								))
							)}
						</ul>
					}
				/>
			</main>
		</div>
	);
}
