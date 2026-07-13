"use client";

import Link from "next/link";
import { useState } from "react";
import { deletePost, togglePostPublish } from "@/lib/actions";

type Post = {
	id: string;
	title: string;
	slug: string;
	published: boolean;
	createdAt: Date;
};

export default function AdminPostList({
	initialPosts,
}: {
	initialPosts: Post[];
}) {
	const [posts, setPosts] = useState(initialPosts);
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

	const filteredPosts = posts.filter((post) => {
		if (filter === "published" && !post.published) return false;
		if (filter === "draft" && post.published) return false;
		if (search && !post.title.toLowerCase().includes(search.toLowerCase()))
			return false;
		return true;
	});

	const handleToggle = async (id: string, currentPublished: boolean) => {
		// Optimistic update
		setPosts(
			posts.map((p) =>
				p.id === id ? { ...p, published: !currentPublished } : p,
			),
		);
		try {
			await togglePostPublish(id, currentPublished);
		} catch (_e) {
			// Revert on error
			setPosts(posts);
			alert("Failed to update status");
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this post?")) return;
		setPosts(posts.filter((p) => p.id !== id));
		try {
			await deletePost(id);
		} catch (_e) {
			setPosts(posts);
			alert("Failed to delete post");
		}
	};

	return (
		<div className="flex flex-col gap-6">
			{/* Controls */}
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="flex flex-1 items-center gap-3">
					<input
						type="text"
						placeholder="Search posts..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full max-w-xs rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
					/>
					<select
						value={filter}
						onChange={(e) =>
							setFilter(e.target.value as "all" | "published" | "draft")
						}
						className="rounded-xl border border-white/10 bg-[#0d1526] px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-white/20"
					>
						<option value="all">All status</option>
						<option value="published">Published</option>
						<option value="draft">Drafts</option>
					</select>
				</div>
				<Link
					href="/admin/posts/new"
					className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white/15 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/25 sm:min-h-9"
				>
					+ New Post
				</Link>
			</div>

			{/* List */}
			{filteredPosts.length === 0 ? (
				<p className="text-zinc-500">No posts found.</p>
			) : (
				<ul className="flex flex-col gap-4">
					{filteredPosts.map((post) => (
						<li
							key={post.id}
							className="card-glass-dim flex flex-col gap-4 rounded-2xl border border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
						>
							<div className="flex flex-col gap-1">
								<h3 className="font-serif text-lg font-medium text-white">
									{post.title}
								</h3>
								<div className="flex items-center gap-3 text-xs text-zinc-500">
									<time dateTime={post.createdAt.toISOString()}>
										{new Date(post.createdAt).toLocaleDateString()}
									</time>
									<span>•</span>
									<span
										className={`rounded-full px-2 py-0.5 font-medium ${
											post.published
												? "bg-green-500/15 text-green-400"
												: "bg-amber-500/15 text-amber-400"
										}`}
									>
										{post.published ? "Published" : "Draft"}
									</span>
								</div>
							</div>

							<div className="flex items-center gap-3 sm:ml-auto">
								<button
									type="button"
									onClick={() => handleToggle(post.id, post.published)}
									className="min-h-11 rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/15 sm:min-h-9"
								>
									{post.published ? "Unpublish" : "Publish"}
								</button>
								<Link
									href={`/admin/posts/${post.id}/edit`}
									className="min-h-11 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/15 sm:min-h-9"
								>
									Edit
								</Link>
								<button
									type="button"
									onClick={() => handleDelete(post.id)}
									className="min-h-11 rounded-lg border border-red-500/20 bg-red-500/10 px-3 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20 sm:min-h-9"
								>
									Delete
								</button>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
