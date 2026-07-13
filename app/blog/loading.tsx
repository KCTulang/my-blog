// Skeleton that matches the real post-list layout exactly (MVP #4)
export default function BlogLoading() {
	return (
		<div className="relative flex flex-1 flex-col overflow-hidden">
			<main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-6 pb-16 pt-28">
				{/* Page title skeleton */}
				<div className="mb-2 h-10 w-36 animate-pulse rounded-lg bg-white/10" />
				<div className="mb-10 h-5 w-52 animate-pulse rounded-md bg-white/5" />

				<ul className="flex flex-col gap-5">
					{["skeleton-1", "skeleton-2", "skeleton-3"].map((id) => (
						<li
							key={id}
							className="card-glass-dim rounded-2xl border border-white/10 px-7 py-6"
						>
							{/* Title */}
							<div className="mb-2 h-6 w-3/4 animate-pulse rounded-md bg-white/10" />
							{/* Date */}
							<div className="mb-4 h-3 w-24 animate-pulse rounded bg-white/5" />
							{/* Excerpt lines */}
							<div className="mb-2 h-3 w-full animate-pulse rounded bg-white/5" />
							<div className="mb-2 h-3 w-5/6 animate-pulse rounded bg-white/5" />
							<div className="h-3 w-2/3 animate-pulse rounded bg-white/5" />
							{/* Footer row */}
							<div className="mt-5 flex justify-between">
								<div className="h-3 w-16 animate-pulse rounded bg-white/8" />
								<div className="h-3 w-12 animate-pulse rounded bg-white/5" />
							</div>
						</li>
					))}
				</ul>
			</main>
		</div>
	);
}
