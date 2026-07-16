import { Skeleton } from "@/components/ui/skeleton";
import { BlogPostCardSkeleton } from "./BlogPostCardSkeleton";
import { TagFilterBarSkeleton } from "./TagFilterBarSkeleton";

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
				<TagFilterBarSkeleton />

				<ul className="flex flex-col gap-4 sm:gap-5">
					{["skeleton-1", "skeleton-2", "skeleton-3"].map((id) => (
						<BlogPostCardSkeleton key={id} />
					))}
				</ul>
			</main>
		</div>
	);
}
