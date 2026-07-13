import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import PostEditor from "@/components/PostEditor";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";

export const metadata: Metadata = {
	title: "Edit Post — Admin · Loonary",
	robots: { index: false, follow: false },
};

// ── Dynamic island ─────────────────────────────────────────────────────────────
// Params and the DB query are inside Suspense so they run at request time,
// not at build-time prerender. This is the correct PPR pattern for dynamic routes.

async function EditFormIsland({
	paramsPromise,
}: {
	paramsPromise: Promise<{ id: string }>;
}) {
	const session = await verifySession();
	if (!session) redirect("/admin");

	const { id } = await paramsPromise;
	const post = await db.query.posts.findFirst({
		where: (p, { eq }) => eq(p.id, id),
	});

	if (!post) {
		notFound();
	}

	return (
		<>
			<p className="mb-10 text-sm text-zinc-500">Editing: {post.title}</p>
			<div className="card-glass-dim rounded-3xl border border-white/10 px-5 py-6 sm:px-8 sm:py-8">
				<PostEditor post={post} />
			</div>
		</>
	);
}

function EditFormSkeleton() {
	return (
		<div className="card-glass-dim flex flex-col gap-5 rounded-3xl border border-white/10 px-5 py-6 sm:px-8 sm:py-8">
			{["f1", "f2", "f3"].map((id) => (
				<div
					key={id}
					className="h-10 w-full animate-pulse rounded-xl bg-white/5"
				/>
			))}
		</div>
	);
}

// ── Page (static shell) ────────────────────────────────────────────────────────

export default function AdminEditPostPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	return (
		<div className="relative flex flex-1 flex-col overflow-hidden">
			<div
				aria-hidden="true"
				className="ambient-glow-post pointer-events-none absolute inset-0 z-0"
			/>

			<main className="relative z-10 mx-auto w-full max-w-2xl flex-1 px-4 pt-24 sm:px-6 sm:pt-28 pb-[calc(5rem+env(safe-area-inset-bottom))]">
				<h1 className="mb-2 font-serif text-2xl font-semibold text-white sm:text-3xl">
					Edit post
				</h1>

				<Suspense fallback={<EditFormSkeleton />}>
					<EditFormIsland paramsPromise={params} />
				</Suspense>
			</main>
		</div>
	);
}
