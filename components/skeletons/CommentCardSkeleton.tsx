import { Skeleton } from "@/components/ui/skeleton";

export function CommentCardSkeleton() {
	return (
		<div className="card-glass-faint rounded-xl border border-white/10 px-4 py-4 sm:px-5">
			<Skeleton className="mb-1 h-4 w-28" />
			<Skeleton className="mb-2 h-4 w-full bg-white/5" />
			<Skeleton className="mb-2 h-4 w-4/5 bg-white/5" />
			<Skeleton className="mt-2 h-3 w-16 bg-white/5" />
		</div>
	);
}
