import { Skeleton } from "@/components/ui/skeleton";

export function BlogListSkeleton() {
	return (
		<div className="relative flex flex-1 flex-col overflow-hidden">
			<main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-6 pb-16 pt-28">
				{/* Page title skeleton */}
				<Skeleton className="mb-2 h-10 w-36" />
				<Skeleton className="mb-10 h-5 w-52 bg-white/5" />

				<ul className="flex flex-col gap-5">
					{["skeleton-1", "skeleton-2", "skeleton-3"].map((id) => (
						<li
							key={id}
							className="card-glass-dim rounded-2xl border border-white/10 px-7 py-6"
						>
							{/* Title */}
							<Skeleton className="mb-2 h-6 w-3/4" />
							{/* Date */}
							<Skeleton className="mb-4 h-3 w-24 bg-white/5" />
							{/* Excerpt lines */}
							<Skeleton className="mb-2 h-3 w-full bg-white/5" />
							<Skeleton className="mb-2 h-3 w-5/6 bg-white/5" />
							<Skeleton className="h-3 w-2/3 bg-white/5" />
							{/* Footer row */}
							<div className="mt-5 flex justify-between">
								<Skeleton className="h-3 w-16 bg-white/8" />
								<Skeleton className="h-3 w-12 bg-white/5" />
							</div>
						</li>
					))}
				</ul>
			</main>
		</div>
	);
}
