export function AdminPostFormSkeleton() {
	return (
		<div className="relative flex flex-1 flex-col overflow-hidden">
			<main className="relative z-10 mx-auto w-full max-w-2xl flex-1 px-6 pb-20 pt-28">
				{/* Title skeleton */}
				<div className="mb-2 h-9 w-36 animate-pulse rounded-lg bg-white/10" />
				<div className="mb-10 h-4 w-52 animate-pulse rounded bg-white/5" />

				<div className="card-glass-dim rounded-2xl border border-white/10 px-7 py-8">
					<div className="flex flex-col gap-5">
						{/* Field skeletons */}
						{["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"].map((id) => (
							<div key={id}>
								<div className="mb-1 h-3 w-20 animate-pulse rounded bg-white/5" />
								<div className="h-10 w-full animate-pulse rounded-xl bg-white/5" />
							</div>
						))}
						<div className="h-10 w-full animate-pulse rounded-xl bg-white/10" />
					</div>
				</div>
			</main>
		</div>
	);
}
