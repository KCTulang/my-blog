import { and, arrayContains, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";

// Dynamic comment count
async function CommentCount({ postId }: { postId: string }) {
	const post = await db.query.posts.findFirst({
		where: (p, { eq }) => eq(p.id, postId),
		with: {
			comments: {
				where: (c, { eq }) => eq(c.approved, true),
			},
		},
	});
	const count = post?.comments.length ?? 0;
	return (
		<span className="text-xs text-zinc-500">
			{count} {count === 1 ? "comment" : "comments"}
		</span>
	);
}

// Tag filter bar — horizontal scroll on mobile so it never wraps to multiple lines
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

	// Collect all unique tags across all posts for the filter bar
	const tagRows = await db.select({ tags: posts.tags }).from(posts);
	const allTags = [...new Set(tagRows.flatMap((r) => r.tags))].sort();

	// Fetch published posts
	const baseQuery = db
		.select()
		.from(posts)
		.where(eq(posts.published, true))
		.orderBy(desc(posts.createdAt));
	const postList = tag
		? await db
				.select()
				.from(posts)
				.where(and(eq(posts.published, true), arrayContains(posts.tags, [tag])))
				.orderBy(desc(posts.createdAt))
		: await baseQuery;

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

				{/* Tag filter bar — horizontally scrollable on mobile */}
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
								<Link
									href={`/blog/${post.slug}`}
									className="card-glass-dim group block rounded-2xl border border-white/10 px-5 py-5 transition-all duration-200 hover:border-white/20 sm:px-7 sm:py-6"
								>
									{/* Title — min-w-0 prevents flex overflow on narrow columns */}
									<h2 className="mb-1 min-w-0 truncate font-serif text-lg font-semibold text-white transition-colors duration-200 group-hover:text-white/90 sm:text-xl sm:whitespace-normal sm:overflow-visible">
										{post.title}
									</h2>
									<time
										dateTime={post.createdAt.toISOString()}
										className="mb-3 block text-xs text-zinc-500"
									>
										{post.createdAt.toLocaleDateString("en-US", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</time>
									{/* Excerpt — 3 lines on mobile, uncapped on sm+ */}
									<p className="line-clamp-3 text-sm font-light leading-relaxed text-zinc-400 sm:line-clamp-none">
										{post.body.length > 160
											? `${post.body.substring(0, 160)}…`
											: post.body}
									</p>

									{/* Tags */}
									{post.tags.length > 0 && (
										<div className="mt-3 flex flex-wrap gap-1.5">
											{post.tags.map((t) => (
												<span key={t} className="tag-pill tag-pill-sm">
													{t}
												</span>
											))}
										</div>
									)}

									{/* Footer row */}
									<div className="mt-4 flex items-center justify-between">
										<span className="min-h-[44px] flex items-center text-xs font-semibold text-white/50 transition-colors duration-200 group-hover:text-white/70">
											Read more →
										</span>
										{/* PPR dynamic island: comment count fetched at request time */}
										<Suspense
											fallback={
												<span className="text-xs text-zinc-600">…</span>
											}
										>
											<CommentCount postId={post.id} />
										</Suspense>
									</div>
								</Link>
							</li>
						))}
					</ul>
				)}
			</main>
		</div>
	);
}
