import { Skeleton } from "@/components/ui/skeleton";

export function AdminPostListSkeleton() {
	return (
		<div className="flex flex-col gap-4">
			{["s1", "s2", "s3"].map((id) => (
				<div
					key={id}
					className="card-glass-dim flex flex-col gap-3 rounded-2xl border border-white/10 px-5 py-4"
				>
					<Skeleton className="h-5 w-48" />
					<Skeleton className="h-3 w-32 bg-white/5" />
				</div>
			))}
		</div>
	);
}
