import { Skeleton } from "@/components/ui/skeleton";

export function CommentFormSkeleton() {
	return (
		<div>
			<Skeleton className="mb-4 h-6 w-36" />
			<Skeleton className="mb-2 h-3 w-16 bg-white/5" />
			<Skeleton className="mb-4 h-11 w-full rounded-xl bg-white/5" />
			<Skeleton className="mb-2 h-3 w-20 bg-white/5" />
			<Skeleton className="mb-4 h-32 w-full rounded-xl bg-white/5" />
			<Skeleton className="h-11 w-full rounded-xl" />
		</div>
	);
}
