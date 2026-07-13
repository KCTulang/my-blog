import Link from "next/link";
import { notFound } from "next/navigation";
import CommentForm from "@/components/CommentForm";
import { db } from "@/lib/db";

// Comment list

async function CommentList({ postId }: { postId: string }) {
	const post = await db.query.posts.findFirst({
		where: (p, { eq }) => eq(p.id, postId),
		with: { comments: true },
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
					className="card-glass-faint rounded-xl border border-white/10 px-5 py-4"
				>
					<p className="mb-1 text-sm font-semibold text-white">
						{c.authorName}
					</p>
					<p className="text-sm font-light leading-relaxed text-zinc-400">
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
		where: (p, { eq }) => eq(p.slug, slug),
	});

	// Calls Next.js notFound() if slug doesn't match any post
	if (!post) {
		notFound();
	}

	return (
		<div className="relative flex flex-1 flex-col overflow-hidden">
			<div
				aria-hidden="true"
				className="ambient-glow-post pointer-events-none absolute inset-0 z-0"
			/>

			<main className="relative z-10 mx-auto w-full max-w-2xl flex-1 px-6 pb-20 pt-28">
				{/* Back link */}
				<Link
					href="/blog"
					className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors duration-200"
				>
					← All stories
				</Link>

				{/* Post header */}
				<article>
					<h1 className="mb-3 font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl">
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

					{/* Post body */}
					<div className="prose prose-invert prose-zinc max-w-none">
						<p className="text-base font-light leading-relaxed text-zinc-300 whitespace-pre-wrap">
							{post.body}
						</p>
					</div>
				</article>

				{/* Divider */}
				<hr className="my-12 border-white/10" />

				{/* Comment list */}
				<section>
					<h2 className="mb-6 font-serif text-2xl font-semibold text-white">
						Comments
					</h2>
					<CommentList postId={post.id} />
				</section>

				{/* Comment form */}
				<CommentForm postId={post.id} slug={post.slug} />
			</main>
		</div>
	);
}
