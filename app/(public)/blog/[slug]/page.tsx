import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import CommentForm from "@/components/CommentForm";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";

// Comment list

async function CommentList({ postId }: { postId: string }) {
	const post = await db.query.posts.findFirst({
		where: (p, { eq }) => eq(p.id, postId),
		with: {
			comments: {
				where: (c, { and, eq, isNull }) =>
					and(eq(c.approved, true), isNull(c.deletedAt)),
				orderBy: (c, { asc }) => [asc(c.createdAt)],
			},
		},
	});

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
					className="card-glass-faint rounded-xl border border-white/10 px-4 py-4 sm:px-5"
				>
					<p className="mb-1 text-sm font-semibold text-white">
						{c.authorName}
					</p>
					{/* break-words prevents long URLs / unspaced text from overflowing */}
					<p className="wrap-break-word text-sm font-light leading-relaxed text-zinc-400">
						{c.body}
					</p>
					<time
						dateTime={c.createdAt.toISOString()}
						className="mt-2 block text-xs text-zinc-600"
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

// Post page

interface PostPageProps {
	params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
	// await params per Next.js 15 requirement
	const { slug } = await params;

	const post = await db.query.posts.findFirst({
		where: (p, { and, eq, isNull }) =>
			and(eq(p.slug, slug), isNull(p.deletedAt)),
	});

	// Calls Next.js notFound() if slug doesn't match any post
	if (!post) {
		notFound();
	}

	// 404 if post is a draft and user is not an admin
	if (!post.published) {
		const session = await verifySession();
		if (!session) {
			notFound();
		}
	}

	return (
		<div className="relative flex flex-1 flex-col overflow-hidden">
			<div
				aria-hidden="true"
				className="ambient-glow-post pointer-events-none absolute inset-0 z-0"
			/>

			<main className="relative z-10 mx-auto w-full max-w-2xl flex-1 px-4 pb-20 pt-24 sm:px-6 sm:pt-28">
				{/* Back link — min touch target via py-3 */}
				<Link
					href="/blog"
					className="-ml-1 mb-8 inline-flex min-h-11 items-center gap-1 text-sm text-zinc-400 transition-colors duration-200 hover:text-white"
				>
					← All stories
				</Link>

				{/* Post header */}
				<article>
					{/* Title scales down on mobile: text-2xl → sm:text-3xl → sm:text-4xl */}
					<h1 className="mb-3 font-serif text-2xl font-semibold leading-tight text-white sm:text-3xl md:text-4xl">
						{post.title}
					</h1>
					<time
						dateTime={post.createdAt.toISOString()}
						className="mb-8 block text-sm text-zinc-500"
					>
						{post.createdAt.toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</time>

					{/* Post body — flat surface (no glass), intentional for readability */}
					<div className="prose prose-invert prose-zinc max-w-none">
						<p className="wrap-break-word text-base font-light leading-relaxed text-zinc-300 whitespace-pre-wrap">
							{post.body}
						</p>
					</div>
				</article>

				{/* Divider */}
				<hr className="my-10 border-white/10 sm:my-12" />

				{/* Comment list */}
				<section>
					<h2 className="mb-6 font-serif text-xl font-semibold text-white sm:text-2xl">
						Comments
					</h2>
					<Suspense
						fallback={
							<div className="h-20 w-full animate-pulse rounded bg-white/5" />
						}
					>
						<CommentList postId={post.id} />
					</Suspense>
				</section>

				{/* Comment form */}
				<CommentForm postId={post.id} slug={post.slug} />
			</main>
		</div>
	);
}
