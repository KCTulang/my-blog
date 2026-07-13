import { Skeleton } from "@/components/ui/skeleton";

export function AdminCommentListSkeleton() {
	return (
		<div className="flex flex-col gap-4">
			{["sk-1", "sk-2", "sk-3"].map((id) => (
				<div
					key={id}
					className="card-glass-dim rounded-2xl border border-white/10 px-6 py-5"
				>
					<div className="mb-3 flex gap-3">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-14 bg-amber-500/10" />
					</div>
					<Skeleton className="mb-2 h-3 w-full bg-white/5" />
					<Skeleton className="h-3 w-3/4 bg-white/5" />
				</div>
			))}
		</div>
	);
}
