import { Skeleton } from "@/components/ui/skeleton";

export function BlogPostCardSkeleton() {
	return (
		<li className="card-glass-dim rounded-2xl border border-white/10 px-5 py-5 sm:px-7 sm:py-6">
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
	);
}
