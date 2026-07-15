import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import PostEditor from "@/components/PostEditor";
import { verifySession } from "@/lib/session";

export const metadata: Metadata = {
	title: "New Post — Admin · Loonary",
	description: "Admin page to publish a new blog post.",
};

async function NewPostIsland() {
	const session = await verifySession();
	if (!session) redirect("/admin");

	return (
		<div className="card-glass-dim rounded-3xl border border-white/10 px-5 py-6 sm:px-8 sm:py-8">
			<PostEditor />
		</div>
	);
}

export default function AdminNewPostPage() {
	return (
		<div className="relative flex flex-1 flex-col overflow-hidden">
			<div
				aria-hidden="true"
				className="ambient-glow-post pointer-events-none absolute inset-0 z-0"
			/>

			<main className="relative z-10 mx-auto w-full max-w-2xl flex-1 px-4 pt-24 sm:px-6 sm:pt-28 pb-[calc(5rem+env(safe-area-inset-bottom))]">
				<h1 className="mb-2 font-serif text-2xl font-semibold text-white sm:text-3xl">
					New post
				</h1>
				<p className="mb-10 text-sm text-zinc-500">
					Write and publish a new entry to the diary.
				</p>

				<Suspense
					fallback={
						<div className="h-[500px] w-full animate-pulse rounded-3xl bg-white/5" />
					}
				>
					<NewPostIsland />
				</Suspense>
			</main>
		</div>
	);
}
