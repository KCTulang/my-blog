import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import CommentForm from "@/components/CommentForm";
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
					className="card-glass-faint rounded-xl border border-white/10 px-4 py-4 sm:px-5"
				>
					<p className="mb-1 text-sm font-semibold text-white">
						{c.authorName}
					</p>
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

interface PostPageProps {
	params: Promise<{ slug: string }>;
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

				<div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
					<article className="flex-1 w-full lg:max-w-4xl card-glass-dim rounded-3xl border border-white/10 p-6 sm:p-10 lg:p-12">
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

						<div className="prose max-w-none text-zinc-300 prose-p:leading-relaxed prose-p:text-zinc-300 prose-headings:font-serif prose-headings:text-white prose-a:text-light-blue hover:prose-a:text-white prose-strong:text-white prose-ul:list-disc prose-ol:list-decimal prose-ul:pl-6 prose-ol:pl-6 prose-li:my-1 prose-li:text-zinc-300">
							{post.body}
						</div>
					</article>

					<div className="w-full lg:w-[320px] xl:w-95 shrink-0 flex flex-col gap-10 lg:sticky lg:top-32">
						<div className="card-glass-dim rounded-3xl border border-white/10 p-6 sm:p-8 flex flex-col gap-8">
							<section>
								<h2 className="mb-6 font-serif text-xl font-semibold text-white">
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

							<CommentForm postId={post.id} slug={post.slug} />
						</div>

						<hr className="block lg:hidden my-2 border-white/10" />

						<section className="card-glass-dim rounded-3xl border border-white/10 p-6 sm:p-8">
							<h2 className="mb-5 font-serif text-xl font-semibold text-white">
								More Posts
							</h2>
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
												className="block text-sm font-light text-zinc-400 hover:text-white transition-colors"
											>
												{rp.title}
											</Link>
										</li>
									))
								)}
							</ul>
						</section>
					</div>
				</div>
			</main>
		</div>
	);
}
