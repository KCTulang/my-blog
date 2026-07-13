import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AdminPostList from "@/components/AdminPostList";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";

export const metadata: Metadata = {
	title: "Posts · Loonary Admin",
	robots: { index: false, follow: false },
};

// ── Skeleton fallback ─────────────────────────────────────────────────────────

function PostListSkeleton() {
	return (
		<div className="flex flex-col gap-4">
			{["s1", "s2", "s3"].map((id) => (
				<div
					key={id}
					className="card-glass-dim flex flex-col gap-3 rounded-2xl border border-white/10 px-5 py-4"
				>
					<div className="h-5 w-48 animate-pulse rounded bg-white/10" />
					<div className="h-3 w-32 animate-pulse rounded bg-white/5" />
				</div>
			))}
		</div>
	);
}

// ── Dynamic island ────────────────────────────────────────────────────────────

async function PostListIsland() {
	const session = await verifySession();
	if (!session) redirect("/admin");

	const posts = await db.query.posts.findMany({
		orderBy: (p, { desc }) => [desc(p.createdAt)],
	});
	return <AdminPostList initialPosts={posts} />;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminPostsPage() {
	return (
		<div className="relative flex flex-1 flex-col overflow-hidden">
			<div
				aria-hidden="true"
				className="ambient-glow-post pointer-events-none absolute inset-0 z-0"
			/>

			<main className="relative z-10 mx-auto w-full max-w-4xl flex-1 px-4 pt-24 sm:px-6 sm:pt-28 pb-[calc(5rem+env(safe-area-inset-bottom))]">
				<h1 className="mb-2 font-serif text-2xl font-semibold text-white sm:text-3xl">
					Posts
				</h1>
				<p className="mb-8 text-sm text-zinc-500">
					Manage your published posts and drafts.
				</p>

				<Suspense fallback={<PostListSkeleton />}>
					<PostListIsland />
				</Suspense>
			</main>
		</div>
	);
}
