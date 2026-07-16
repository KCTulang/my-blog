import { Skeleton } from "@/components/ui/skeleton";

export function ArticleBodySkeleton() {
	return (
		<article className="flex-1 w-full lg:max-w-4xl card-glass-dim rounded-3xl border border-white/10 p-6 sm:p-10 lg:p-12">
			<Skeleton className="mb-3 h-8 w-4/5 sm:h-9 md:h-10" />
			<Skeleton className="mb-8 h-4 w-32 bg-white/5" />

			<div className="flex flex-col gap-3">
				<Skeleton className="h-4 w-full bg-white/5" />
				<Skeleton className="h-4 w-11/12 bg-white/5" />
				<Skeleton className="h-4 w-full bg-white/5" />
				<Skeleton className="h-4 w-4/5 bg-white/5" />
				<Skeleton className="h-4 w-full bg-white/5" />
				<Skeleton className="h-4 w-3/4 bg-white/5" />
			</div>
		</article>
	);
}
