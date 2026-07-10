import { db } from "@/lib/db";

export default async function Home() {
	// Fetch live posts from Neon Postgres ordered by newest first
	const posts = await db.query.posts.findMany({
		orderBy: (posts, { desc }) => [desc(posts.createdAt)],
		with: {
			comments: true,
		},
	});

	return (
		<div className="pt-20 flex flex-col flex-1 items-center min-h-screen">
			<main className="flex flex-1 w-full max-w-3xl flex-col py-24 px-6 sm:px-16 sm:items-start">
				<h1 className="text-4xl font-bold font-serif text-[#f8f9fa] tracking-tight sm:text-5xl md:text-6xl">
					Loonary
				</h1>
				<p className="mt-3 text-lg font-sans font-light text-zinc-400">
					A moonlit digital diary.
				</p>

				{/* Main Dynamic Blog Feed Grid */}
				<div className="mt-16 w-full flex flex-col gap-10">
					{posts.length === 0 ? (
						<p className="text-zinc-500 font-sans italic">
							No stories under the moonlight yet.
						</p>
					) : (
						posts.map((post) => (
							<article
								key={post.id}
								// Translucent glassmorphic container
								className="bg-white/20 backdrop-blur-md border border-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:border-white/40 hover:bg-white/20"
							>
								{/* Post Title */}
								<h2 className="text-2xl sm:text-3xl font-serif text-[#f8f9fa] mb-3 leading-snug">
									{post.title}
								</h2>

								{/* Post Body Paragraph Fragment */}
								<p className="text-zinc-300 font-sans font-light leading-relaxed text-sm sm:text-base">
									{post.body.length > 200
										? `${post.body.substring(0, 200)}...`
										: post.body}
								</p>

								{/* Timestamp */}
								<span className="text-xs font-sans text-zinc-500 mt-4 block uppercase tracking-wider">
									{new Date(post.createdAt).toLocaleDateString(undefined, {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</span>

								{/* Translucent Inline Comment Block Shell */}
								<div className="mt-6 pt-6 border-t border-white/6">
									<h3 className="text-xs font-semibold font-sans text-[#f8f9fa]/80 mb-4 uppercase tracking-widest">
										Comments ({post.comments.length})
									</h3>

									{post.comments.length === 0 ? (
										<p className="text-xs text-zinc-500 font-sans italic">
											Be the first to leave a thought.
										</p>
									) : (
										<ul className="space-y-3">
											{post.comments.map((comment) => (
												<li
													key={comment.id}
													className="bg-white/20 border border-white/3 p-4 rounded-xl"
												>
													<div className="flex justify-between items-center mb-1">
														<span className="font-medium text-xs sm:text-sm text-[#f8f9fa]">
															{comment.authorName}
														</span>
														<span className="text-[10px] text-zinc-500 font-sans">
															{new Date(comment.createdAt).toLocaleDateString()}
														</span>
													</div>
													<p className="text-xs sm:text-sm font-sans font-light text-zinc-400">
														{comment.body}
													</p>
												</li>
											))}
										</ul>
									)}
								</div>
							</article>
						))
					)}
				</div>
			</main>
		</div>
	);
}
