import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AdminCommentList from "@/components/AdminCommentList";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";

export const metadata: Metadata = {
	title: "Comment Moderation — Admin · Loonary",
	robots: { index: false, follow: false },
};

// ── Data fetcher (runs dynamically, inside Suspense) ──────────────────────────

async function fetchAllComments() {
	return db.query.comments.findMany({
		with: { post: true },
		orderBy: (c, { desc }) => [desc(c.createdAt)],
	});
}

// ── Skeleton fallback ─────────────────────────────────────────────────────────

function CommentListSkeleton() {
	return (
		<div className="flex flex-col gap-4">
			{["sk-1", "sk-2", "sk-3"].map((id) => (
				<div
					key={id}
					className="card-glass-dim rounded-2xl border border-white/10 px-6 py-5"
				>
					<div className="mb-3 flex gap-3">
						<div className="h-4 w-24 animate-pulse rounded bg-white/10" />
						<div className="h-4 w-14 animate-pulse rounded bg-amber-500/10" />
					</div>
					<div className="mb-2 h-3 w-full animate-pulse rounded bg-white/5" />
					<div className="h-3 w-3/4 animate-pulse rounded bg-white/5" />
				</div>
			))}
		</div>
	);
}

// ── Dynamic island ────────────────────────────────────────────────────────────

async function CommentListIsland() {
	const session = await verifySession();
	if (!session) redirect("/admin");

	const allComments = await fetchAllComments();
	return <AdminCommentList initialComments={allComments} />;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminCommentsPage() {
	return (
		<div className="relative flex flex-1 flex-col overflow-hidden">
			<div
				aria-hidden="true"
				className="ambient-glow-blog pointer-events-none absolute inset-0 z-0"
			/>

			<main className="relative z-10 mx-auto w-full max-w-4xl flex-1 px-4 pt-24 sm:px-6 sm:pt-28 pb-[calc(5rem+env(safe-area-inset-bottom))]">
				<h1 className="mb-2 font-serif text-2xl font-semibold text-white sm:text-3xl">
					Comment moderation
				</h1>
				<p className="mb-8 text-sm text-zinc-500">
					Approve, delete, filter, and reply to reader comments.
				</p>

				<Suspense fallback={<CommentListSkeleton />}>
					<CommentListIsland />
				</Suspense>
			</main>
		</div>
	);
}
