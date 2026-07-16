import { Skeleton } from "@/components/ui/skeleton";

export function MorePostsSkeleton() {
	return (
		<section className="card-glass-dim rounded-3xl border border-white/10 p-6 sm:p-8">
			<Skeleton className="mb-5 h-7 w-28" />
			<ul className="flex flex-col gap-4">
				{["sk-p1", "sk-p2", "sk-p3"].map((id) => (
					<li key={id}>
						<Skeleton className="h-4 w-4/5 bg-white/5" />
					</li>
				))}
			</ul>
		</section>
	);
}
