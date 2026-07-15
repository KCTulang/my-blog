import { Skeleton } from "@/components/ui/skeleton";

export function BlogListSkeleton() {
	return (
		<div className="relative flex flex-1 flex-col overflow-hidden">
			<div
				aria-hidden="true"
				className="ambient-glow-blog pointer-events-none absolute inset-0 z-0"
			/>

			<main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
				{/* Page title skeleton */}
				<Skeleton className="mb-2 h-8 w-24 sm:h-10 sm:w-36" />
				<Skeleton className="mb-6 h-5 w-40 sm:h-6 sm:w-52 bg-white/5" />

				{/* Tag filter bar skeleton */}
				<div className="mb-8 -mx-1 overflow-x-auto">
					<div className="flex min-w-max gap-2 px-1 pb-1">
						<Skeleton className="h-7 w-12 rounded-full" />
						<Skeleton className="h-7 w-16 rounded-full bg-white/5" />
						<Skeleton className="h-7 w-20 rounded-full bg-white/5" />
						<Skeleton className="h-7 w-14 rounded-full bg-white/5" />
					</div>
				</div>

				<ul className="flex flex-col gap-4 sm:gap-5">
					{["skeleton-1", "skeleton-2", "skeleton-3"].map((id) => (
						<li
							key={id}
							className="card-glass-dim rounded-2xl border border-white/10 px-5 py-5 sm:px-7 sm:py-6"
						>
							{/* Title */}
							<Skeleton className="mb-1 h-6 w-3/4 sm:h-7" />
							{/* Date */}
							<Skeleton className="mb-3 h-3 w-24 bg-white/5" />
							{/* Excerpt lines */}
							<Skeleton className="mb-2 h-3 w-full bg-white/5" />
							<Skeleton className="mb-2 h-3 w-5/6 bg-white/5" />
							<Skeleton className="h-3 w-2/3 bg-white/5" />

							{/* Tags */}
							<div className="mt-3 flex flex-wrap gap-1.5">
								<Skeleton className="h-5 w-12 rounded-full bg-white/5" />
								<Skeleton className="h-5 w-16 rounded-full bg-white/5" />
							</div>

							{/* Footer row */}
							<div className="mt-4 flex items-center justify-between">
								<div className="min-h-11 flex items-center">
									<Skeleton className="h-3 w-16 bg-white/8" />
								</div>
								<Skeleton className="h-3 w-16 bg-white/5" />
							</div>
						</li>
					))}
				</ul>
			</main>
		</div>
	);
}
