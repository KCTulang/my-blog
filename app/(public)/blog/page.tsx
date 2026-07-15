import { and, arrayContains, desc, eq, isNull } from "drizzle-orm";
import Link from "next/link";
import { Suspense } from "react";
import BlogPostCard from "@/components/BlogPostCard";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";

async function CommentCount({ postId }: { postId: string }) {
	const post = await db.query.posts
		.findFirst({
			where: (p, { eq }) => eq(p.id, postId),
			with: {
				comments: {
					where: (c, { eq }) => eq(c.approved, true),
				},
			},
		})
		.catch(() => null);
	const count = post?.comments.length ?? 0;
	return (
		<span className="text-xs text-zinc-500">
			{count} {count === 1 ? "comment" : "comments"}
		</span>
	);
}

function TagFilterBar({
	tags,
	activeTag,
}: {
	tags: string[];
	activeTag?: string;
}) {
	if (tags.length === 0) return null;
	return (
		<div className="mb-8 -mx-1 overflow-x-auto">
			<div className="flex min-w-max gap-2 px-1 pb-1">
				<Link
					href="/blog"
					className={`tag-pill ${!activeTag ? "tag-pill-active" : ""}`}
				>
					All
				</Link>
				{tags.map((tag) => (
					<Link
						key={tag}
						href={`/blog?tag=${encodeURIComponent(tag)}`}
						className={`tag-pill ${activeTag === tag ? "tag-pill-active" : ""}`}
					>
						{tag}
					</Link>
				))}
			</div>
		</div>
	);
}

interface BlogPageProps {
	searchParams: Promise<{ tag?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
	const { tag } = await searchParams;

	const tagRows = await db
		.select({ tags: posts.tags })
		.from(posts)
		.where(isNull(posts.deletedAt))
		.catch(() => []);
	const allTags = [...new Set(tagRows.flatMap((r) => r.tags))].sort();

	const baseQuery = db
		.select()
		.from(posts)
		.where(and(eq(posts.published, true), isNull(posts.deletedAt)))
		.orderBy(desc(posts.createdAt));

	const postList = await (tag
		? db
				.select()
				.from(posts)
				.where(
					and(
						eq(posts.published, true),
						isNull(posts.deletedAt),
						arrayContains(posts.tags, [tag]),
					),
				)
				.orderBy(desc(posts.createdAt))
		: baseQuery
	).catch(() => []);

	return (
		<div className="relative flex flex-1 flex-col overflow-hidden">
			<div
				aria-hidden="true"
				className="ambient-glow-blog pointer-events-none absolute inset-0 z-0"
			/>

			<main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
				<h1 className="mb-2 font-serif text-2xl font-semibold text-white sm:text-4xl">
					Stories
				</h1>
				<p className="mb-6 font-serif text-sm text-light-blue sm:text-base">
					a moonlit digital diary
				</p>

				<TagFilterBar tags={allTags} activeTag={tag} />

				{postList.length === 0 ? (
					<p className="text-zinc-500">
						{tag
							? `No posts tagged "${tag}".`
							: "No posts yet. Check back soon."}
					</p>
				) : (
					<ul className="flex flex-col gap-4 sm:gap-5">
						{postList.map((post) => (
							<li key={post.id}>
								<BlogPostCard
									post={post}
									commentCountSlot={
										<Suspense
											fallback={
												<span className="text-xs text-zinc-600">…</span>
											}
										>
											<CommentCount postId={post.id} />
										</Suspense>
									}
								/>
							</li>
						))}
					</ul>
				)}
			</main>
		</div>
	);
}
