import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/lib/db";

// Dynamic comment count
async function CommentCount({ postId }: { postId: string }) {
	const post = await db.query.posts.findFirst({
		where: (p, { eq }) => eq(p.id, postId),
		with: { comments: true },
	});
	const count = post?.comments.length ?? 0;
	return (
		<span className="text-xs text-zinc-500">
			{count} {count === 1 ? "comment" : "comments"}
		</span>
	);
}

export default async function BlogPage() {
	const posts = await db.query.posts.findMany({
		orderBy: (p, { desc }) => [desc(p.createdAt)],
	});

	return (
		<div className="relative flex flex-1 flex-col overflow-hidden">
			<div
				aria-hidden="true"
				className="ambient-glow-blog pointer-events-none absolute inset-0 z-0"
			/>

			<main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-6 pb-16 pt-28">
				<h1 className="mb-2 font-serif text-4xl font-semibold text-white">
					Stories
				</h1>
				<p className="mb-10 font-serif text-light-blue">
					a moonlit digital diary
				</p>

				{posts.length === 0 ? (
					<p className="text-zinc-500">No posts yet. Check back soon.</p>
				) : (
					<ul className="flex flex-col gap-5">
						{posts.map((post) => (
							<li key={post.id}>
								<Link
									href={`/blog/${post.slug}`}
									className="card-glass-dim group block rounded-2xl border border-white/10 px-7 py-6 transition-all duration-200 hover:border-white/20"
								>
									<h2 className="mb-1 font-serif text-xl font-semibold text-white group-hover:text-white/90 transition-colors duration-200">
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
									<p className="text-sm font-light text-zinc-400 leading-relaxed">
										{post.body.length > 120
											? `${post.body.substring(0, 120)}…`
											: post.body}
									</p>
									<div className="mt-4 flex items-center justify-between">
										<span className="text-xs font-semibold text-white/50 group-hover:text-white/70 transition-colors duration-200">
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
