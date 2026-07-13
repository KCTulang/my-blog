// Skeleton matching the real post page layout (acceptance criteria: loading.tsx for /blog/[slug])
export default function PostLoading() {
	return (
		<div className="relative flex flex-1 flex-col overflow-hidden">
			<main className="relative z-10 mx-auto w-full max-w-2xl flex-1 px-6 pb-20 pt-28">
				{/* Back link skeleton */}
				<div className="mb-8 h-4 w-24 animate-pulse rounded bg-white/10" />

				{/* Post title skeleton */}
				<div className="mb-2 h-10 w-4/5 animate-pulse rounded-lg bg-white/10" />
				<div className="mb-8 h-4 w-28 animate-pulse rounded bg-white/5" />

				{/* Body skeleton */}
				<div className="flex flex-col gap-3">
					<div className="h-4 w-full animate-pulse rounded bg-white/5" />
					<div className="h-4 w-11/12 animate-pulse rounded bg-white/5" />
					<div className="h-4 w-full animate-pulse rounded bg-white/5" />
					<div className="h-4 w-4/5 animate-pulse rounded bg-white/5" />
					<div className="h-4 w-full animate-pulse rounded bg-white/5" />
					<div className="h-4 w-3/4 animate-pulse rounded bg-white/5" />
				</div>

				{/* Divider */}
				<div className="my-12 h-px w-full bg-white/10" />

				{/* Comments section skeleton */}
				<div className="mb-6 h-7 w-32 animate-pulse rounded-lg bg-white/10" />
				<div className="flex flex-col gap-4">
					{["sk-c1", "sk-c2"].map((id) => (
						<div
							key={id}
							className="card-glass-faint rounded-xl border border-white/10 px-5 py-4"
						>
							<div className="mb-2 h-4 w-28 animate-pulse rounded bg-white/10" />
							<div className="mb-1 h-3 w-full animate-pulse rounded bg-white/5" />
							<div className="h-3 w-3/4 animate-pulse rounded bg-white/5" />
						</div>
					))}
				</div>

				{/* Comment form skeleton */}
				<div className="mt-10">
					<div className="mb-4 h-6 w-36 animate-pulse rounded-lg bg-white/10" />
					<div className="mb-2 h-3 w-16 animate-pulse rounded bg-white/5" />
					<div className="mb-4 h-10 w-full animate-pulse rounded-xl bg-white/5" />
					<div className="mb-2 h-3 w-20 animate-pulse rounded bg-white/5" />
					<div className="mb-4 h-28 w-full animate-pulse rounded-xl bg-white/5" />
					<div className="h-10 w-full animate-pulse rounded-xl bg-white/10" />
				</div>
			</main>
		</div>
	);
}
