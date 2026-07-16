import { Skeleton } from "@/components/ui/skeleton";
import { ArticleBodySkeleton } from "./ArticleBodySkeleton";
import { CommentCardSkeleton } from "./CommentCardSkeleton";
import { CommentFormSkeleton } from "./CommentFormSkeleton";
import { MorePostsSkeleton } from "./MorePostsSkeleton";

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
					<ArticleBodySkeleton />

					<div className="w-full lg:w-[320px] xl:w-95 shrink-0 flex flex-col gap-10 lg:sticky lg:top-32">
						{/* Comments Card skeleton */}
						<div className="card-glass-dim rounded-3xl border border-white/10 p-6 sm:p-8 flex flex-col gap-8">
							{/* Comment list */}
							<section>
								<Skeleton className="mb-6 h-7 w-28" />
								<div className="flex flex-col gap-4">
									{["sk-c1", "sk-c2"].map((id) => (
										<CommentCardSkeleton key={id} />
									))}
								</div>
							</section>

							{/* Comment form skeleton */}
							<CommentFormSkeleton />
						</div>

						{/* Divider for mobile only */}
						<hr className="my-2 block border-white/10 lg:hidden" />

						<MorePostsSkeleton />
					</div>
				</div>
			</main>
		</div>
	);
}
