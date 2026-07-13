import { Skeleton } from "@/components/ui/skeleton";

export function BlogPostSkeleton() {
	return (
		<div className="relative flex flex-1 flex-col overflow-hidden">
			<main className="relative z-10 mx-auto w-full max-w-2xl flex-1 px-6 pb-20 pt-28">
				{/* Back link skeleton */}
				<Skeleton className="mb-8 h-4 w-24" />

				{/* Post title skeleton */}
				<Skeleton className="mb-2 h-10 w-4/5" />
				<Skeleton className="mb-8 h-4 w-28 bg-white/5" />

				{/* Body skeleton */}
				<div className="flex flex-col gap-3">
					<Skeleton className="h-4 w-full bg-white/5" />
					<Skeleton className="h-4 w-11/12 bg-white/5" />
					<Skeleton className="h-4 w-full bg-white/5" />
					<Skeleton className="h-4 w-4/5 bg-white/5" />
					<Skeleton className="h-4 w-full bg-white/5" />
					<Skeleton className="h-4 w-3/4 bg-white/5" />
				</div>

				{/* Divider */}
				<div className="my-12 h-px w-full bg-white/10" />

				{/* Comments section skeleton */}
				<Skeleton className="mb-6 h-7 w-32" />
				<div className="flex flex-col gap-4">
					{["sk-c1", "sk-c2"].map((id) => (
						<div
							key={id}
							className="card-glass-faint rounded-xl border border-white/10 px-5 py-4"
						>
							<Skeleton className="mb-2 h-4 w-28" />
							<Skeleton className="mb-1 h-3 w-full bg-white/5" />
							<Skeleton className="h-3 w-3/4 bg-white/5" />
						</div>
					))}
				</div>

				{/* Comment form skeleton */}
				<div className="mt-10">
					<Skeleton className="mb-4 h-6 w-36" />
					<Skeleton className="mb-2 h-3 w-16 bg-white/5" />
					<Skeleton className="mb-4 h-10 w-full rounded-xl bg-white/5" />
					<Skeleton className="mb-2 h-3 w-20 bg-white/5" />
					<Skeleton className="mb-4 h-28 w-full rounded-xl bg-white/5" />
					<Skeleton className="h-10 w-full rounded-xl" />
				</div>
			</main>
		</div>
	);
}
