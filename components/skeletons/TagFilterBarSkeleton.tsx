import { Skeleton } from "@/components/ui/skeleton";

export function TagFilterBarSkeleton() {
	return (
		<div className="mb-8 -mx-1 overflow-x-auto">
			<div className="flex min-w-max gap-2 px-1 pb-1">
				<Skeleton className="h-7 w-12 rounded-full" />
				<Skeleton className="h-7 w-16 rounded-full bg-white/5" />
				<Skeleton className="h-7 w-20 rounded-full bg-white/5" />
				<Skeleton className="h-7 w-14 rounded-full bg-white/5" />
			</div>
		</div>
	);
}
