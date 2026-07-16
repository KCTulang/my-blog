import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import CommentForm from "@/components/CommentForm";
import PostCardsLayout from "@/components/PostCardsLayout";
import { Metadata } from "next";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";

async function CommentList({ postId }: { postId: string }) {
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

	if (comments.length === 0) {
		return (
			<p className="text-sm text-zinc-500 italic">
				No comments yet. Be the first to share your thoughts!
			</p>
		);
	}

	return (
		<ul className="flex flex-col gap-4">
			{comments.map((c) => (
				<li
					key={c.id}
					className="card-glass-faint group-[.light-cards]:bg-white group-[.light-cards]:shadow-sm rounded-xl border border-white/10 group-[.light-cards]:border-black/10 px-4 py-4 sm:px-5 transition-colors"
				>
					<p className="mb-1 text-sm font-semibold text-white group-[.light-cards]:text-zinc-900 transition-colors">
						{c.authorName}
					</p>
					<p className="wrap-break-word text-sm font-light leading-relaxed text-zinc-400 group-[.light-cards]:text-zinc-600 transition-colors">
						{c.body}
					</p>
					<time
						dateTime={c.createdAt.toISOString()}
						className="mt-2 block text-xs text-zinc-600 group-[.light-cards]:text-zinc-400 transition-colors"
					>
						{c.createdAt.toLocaleDateString("en-US", {
							year: "numeric",
							month: "short",
							day: "numeric",
						})}
					</time>
				</li>
			))}
		</ul>
	);
}

interface PostPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
	const { slug } = await params;
	const post = await db.query.posts
		.findFirst({
			where: (p, { and, eq, isNull }) =>
				and(eq(p.slug, slug), isNull(p.deletedAt)),
		})
		.catch(() => null);

	if (!post) {
		return {
			title: 'Post Not Found',
		};
	}

	const plainTextBody = post.body.replace(/<[^>]+>/g, '').substring(0, 160).trim();

	return {
		title: post.title,
		description: plainTextBody.length > 0 ? `${plainTextBody}...` : `Read ${post.title} on Loonary.`,
		openGraph: {
			title: post.title,
			description: plainTextBody.length > 0 ? `${plainTextBody}...` : `Read ${post.title} on Loonary.`,
			type: 'article',
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
							<CommentList postId={post.id} />
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
