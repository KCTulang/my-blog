import { db } from "@/lib/db";

export default async function Home() {
	const posts = await db.query.posts.findMany({
		orderBy: (posts, { desc }) => [desc(posts.createdAt)],
		with: {
			comments: true,
		},
	});

	return (
		<div className="pt-20 flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black min-h-screen">
			<main className="flex flex-1 w-full max-w-3xl flex-col py-32 px-16 bg-white dark:bg-black sm:items-start">
				<h1 className="text-6xl font-bold text-black dark:text-white sm:text-5xl">
					Loonary: A moonlit digital diary.
				</h1>

				<div className="mt-16 w-full flex flex-col gap-12">
					{posts.length === 0 ? (
						<p className="text-zinc-500">No stories under the moonlight yet.</p>
					) : (
						posts.map((post) => (
							<article
								key={post.id}
								className="border-b border-zinc-200 dark:border-zinc-800 pb-8"
							>
								<h2 className="text-3xl font-serif text-black dark:text-white mb-2">
									{post.title}
								</h2>
								<p className="text-zinc-600 dark:text-zinc-400 font-light">
									{post.body.length > 200
										? `${post.body.substring(0, 200)}...`
										: post.body}
								</p>
								<span className="text-sm text-zinc-400 mt-4 block">
									{new Date(post.createdAt).toLocaleDateString()}
								</span>

								<div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-900">
									<h3 className="text-sm font-medium text-black dark:text-white mb-4 uppercase tracking-wider">
										Comments ({post.comments.length})
									</h3>

									{post.comments.length === 0 ? (
										<p className="text-sm text-zinc-500 italic">
											Be the first to leave a thought.
										</p>
									) : (
										<ul className="space-y-4">
											{post.comments.map((comment) => (
												<li
													key={comment.id}
													className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-lg"
												>
													<div className="flex justify-between items-center mb-2">
														<span className="font-semibold text-sm text-black dark:text-zinc-200">
															{comment.authorName}
														</span>
														<span className="text-xs text-zinc-400">
															{new Date(comment.createdAt).toLocaleDateString()}
														</span>
													</div>
													<p className="text-sm text-zinc-700 dark:text-zinc-400">
														{comment.body}
													</p>
												</li>
											))}
										</ul>
									)}
								</div>
								{/* --- END COMMENTS SECTION --- */}
							</article>
						))
					)}
				</div>
			</main>
		</div>
	);
}
