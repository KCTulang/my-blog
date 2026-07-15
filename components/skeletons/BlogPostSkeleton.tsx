import { Skeleton } from "@/components/ui/skeleton";

export function BlogPostSkeleton() {
	return (
		<div className="relative flex flex-1 flex-col">
			<div
				aria-hidden="true"
				className="ambient-glow-post pointer-events-none absolute inset-0 z-0"
			/>

			<main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 pb-20 pt-24 sm:px-6 sm:pt-28 lg:px-8">
				{/* Back link skeleton */}
				<div className="-ml-1 mb-8 inline-flex min-h-11 items-center">
					<Skeleton className="h-4 w-24" />
				</div>

				<div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
					{/* ── LEFT COLUMN: BLOG POST ── */}
					<article className="flex-1 w-full lg:max-w-4xl card-glass-dim rounded-3xl border border-white/10 p-6 sm:p-10 lg:p-12">
						{/* Title */}
						<Skeleton className="mb-3 h-8 w-4/5 sm:h-9 md:h-10" />
						<Skeleton className="mb-8 h-4 w-32 bg-white/5" />

						{/* Body skeleton */}
						<div className="flex flex-col gap-3">
							<Skeleton className="h-4 w-full bg-white/5" />
							<Skeleton className="h-4 w-11/12 bg-white/5" />
							<Skeleton className="h-4 w-full bg-white/5" />
							<Skeleton className="h-4 w-4/5 bg-white/5" />
							<Skeleton className="h-4 w-full bg-white/5" />
							<Skeleton className="h-4 w-3/4 bg-white/5" />
						</div>
					</article>

					{/* ── RIGHT COLUMN: SIDEBAR ── */}
					<div className="w-full lg:w-[320px] xl:w-[380px] shrink-0 flex flex-col gap-10 lg:sticky lg:top-32">
						{/* Comments Card skeleton */}
						<div className="card-glass-dim rounded-3xl border border-white/10 p-6 sm:p-8 flex flex-col gap-8">
							{/* Comment list */}
							<section>
								<Skeleton className="mb-6 h-7 w-28" />
								<div className="flex flex-col gap-4">
									{["sk-c1", "sk-c2"].map((id) => (
										<div
											key={id}
											className="card-glass-faint rounded-xl border border-white/10 px-4 py-4 sm:px-5"
										>
											<Skeleton className="mb-1 h-4 w-28" />
											<Skeleton className="mb-2 h-4 w-full bg-white/5" />
											<Skeleton className="mb-2 h-4 w-4/5 bg-white/5" />
											<Skeleton className="mt-2 h-3 w-16 bg-white/5" />
										</div>
									))}
								</div>
							</section>

							{/* Comment form skeleton */}
							<div>
								<Skeleton className="mb-4 h-6 w-36" />
								<Skeleton className="mb-2 h-3 w-16 bg-white/5" />
								<Skeleton className="mb-4 h-11 w-full rounded-xl bg-white/5" />
								<Skeleton className="mb-2 h-3 w-20 bg-white/5" />
								<Skeleton className="mb-4 h-32 w-full rounded-xl bg-white/5" />
								<Skeleton className="h-11 w-full rounded-xl" />
							</div>
						</div>

						{/* Divider for mobile only */}
						<hr className="my-2 block border-white/10 lg:hidden" />

						{/* More Posts Navigation skeleton */}
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
					</div>
				</div>
			</main>
		</div>
	);
}
