"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	deletePost,
	hardDeletePost,
	restorePost,
	togglePostPublish,
} from "@/lib/actions";

type Post = {
	id: string;
	title: string;
	slug: string;
	published: boolean;
	createdAt: Date;
	deletedAt: Date | null;
};

function PostRow({
	post,
	onRestore,
	onHardDelete,
	onTogglePublish,
	onDelete,
}: {
	post: Post;
	onRestore: (id: string) => void;
	onHardDelete: (id: string) => void;
	onTogglePublish: (post: Post) => void;
	onDelete: (id: string) => void;
}) {
	return (
		<li className="card-glass-dim flex flex-col gap-4 rounded-2xl border border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
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
							post.deletedAt
								? "bg-red-500/15 text-red-400"
								: post.published
									? "bg-green-500/15 text-green-400"
									: "bg-amber-500/15 text-amber-400"
						}`}
					>
						{post.deletedAt
							? "Trashed"
							: post.published
								? "Published"
								: "Draft"}
					</span>
				</div>
			</div>

			<div className="flex items-center gap-3 sm:ml-auto">
				{post.deletedAt ? (
					<>
						<button
							type="button"
							onClick={() => onRestore(post.id)}
							className="min-h-11 rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/15 sm:min-h-9"
						>
							Restore
						</button>
						<button
							type="button"
							onClick={() => onHardDelete(post.id)}
							className="min-h-11 rounded-lg border border-red-500/20 bg-red-500/10 px-3 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20 sm:min-h-9"
						>
							Permanently Delete
						</button>
					</>
				) : (
					<>
						<button
							type="button"
							onClick={() => onTogglePublish(post)}
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
							onClick={() => onDelete(post.id)}
							className="min-h-11 rounded-lg border border-red-500/20 bg-red-500/10 px-3 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20 sm:min-h-9"
						>
							Delete
						</button>
					</>
				)}
			</div>
		</li>
	);
}

export default function AdminPostList({
	initialPosts,
}: {
	initialPosts: Post[];
}) {
	const [posts, setPosts] = useState(initialPosts);
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<
		"all" | "published" | "draft" | "trashed"
	>("all");
	const [postToDelete, setPostToDelete] = useState<string | null>(null);
	const [postToHardDelete, setPostToHardDelete] = useState<string | null>(null);

	// Modals for Publish / Unpublish
	const [postToPublish, setPostToPublish] = useState<Post | null>(null);
	const [postToUnpublish, setPostToUnpublish] = useState<Post | null>(null);

	// Keep track of pending timeouts for delete undo
	const pendingTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});

	useEffect(() => {
		// Cleanup timeouts on unmount
		return () => {
			Object.values(pendingTimeouts.current).forEach(clearTimeout);
		};
	}, []);

	const filteredPosts = posts.filter((post) => {
		const matchesSearch =
			!search || post.title.toLowerCase().includes(search.toLowerCase());
		if (!matchesSearch) return false;

		if (filter === "trashed") return !!post.deletedAt;
		if (post.deletedAt) return false;
		if (filter === "published") return post.published;
		if (filter === "draft") return !post.published;
		return true;
	});

	const executeToggle = async (id: string, currentPublished: boolean) => {
		// Optimistic update
		setPosts((current) =>
			current.map((p) =>
				p.id === id ? { ...p, published: !currentPublished } : p,
			),
		);
		setPostToPublish(null);
		setPostToUnpublish(null);

		try {
			await togglePostPublish(id, currentPublished);
			toast.success(currentPublished ? "Post unpublished" : "Post published");
		} catch (_e) {
			// Revert on error
			setPosts((current) =>
				current.map((p) =>
					p.id === id ? { ...p, published: currentPublished } : p,
				),
			);
			toast.error("Failed to update status");
		}
	};

	const executeDelete = (id: string) => {
		const postToRestore = posts.find((p) => p.id === id);
		if (!postToRestore) return;

		// Optimistic soft delete
		setPosts((current) =>
			current.map((p) => (p.id === id ? { ...p, deletedAt: new Date() } : p)),
		);
		setPostToDelete(null);

		let executed = false;
		const timeoutKey = `delete-${id}`;

		const timeoutId = setTimeout(async () => {
			executed = true;
			try {
				await deletePost(id);
			} catch (_e) {
				// Revert on error
				setPosts((current) =>
					current.map((p) => (p.id === id ? { ...p, deletedAt: null } : p)),
				);
				toast.error("Failed to delete post");
			}
			delete pendingTimeouts.current[timeoutKey];
		}, 5000);

		pendingTimeouts.current[timeoutKey] = timeoutId;

		toast("Post Trashed", {
			action: {
				label: "Undo",
				onClick: () => {
					if (executed) return;
					clearTimeout(timeoutId);
					delete pendingTimeouts.current[timeoutKey];
					// Revert optimistic delete
					setPosts((current) =>
						current.map((p) => (p.id === id ? { ...p, deletedAt: null } : p)),
					);
				},
			},
			duration: 5000,
		});
	};

	const executeRestore = async (id: string) => {
		// Optimistic restore
		setPosts((current) =>
			current.map((p) => (p.id === id ? { ...p, deletedAt: null } : p)),
		);

		try {
			await restorePost(id);
			toast.success("Post restored");
		} catch (_e) {
			// Revert on error
			setPosts((current) =>
				current.map((p) => (p.id === id ? { ...p, deletedAt: new Date() } : p)),
			);
			toast.error("Failed to restore post");
		}
	};

	const executeHardDelete = async (id: string) => {
		const postToRestore = posts.find((p) => p.id === id);
		if (!postToRestore) return;

		// Optimistic hard delete
		setPosts((current) => current.filter((p) => p.id !== id));
		setPostToHardDelete(null);

		try {
			await hardDeletePost(id);
			toast.success("Post permanently deleted");
		} catch (_e) {
			// Revert on error
			setPosts((current) =>
				[...current, postToRestore].sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
				),
			);
			toast.error("Failed to delete post");
		}
	};

	return (
		<>
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
								setFilter(
									e.target.value as "all" | "published" | "draft" | "trashed",
								)
							}
							className="rounded-xl border border-white/10 bg-[#0d1526] px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-white/20"
						>
							<option value="all">All status</option>
							<option value="published">Published</option>
							<option value="draft">Drafts</option>
							<option value="trashed">Trashed</option>
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
							<PostRow
								key={post.id}
								post={post}
								onRestore={executeRestore}
								onHardDelete={setPostToHardDelete}
								onTogglePublish={(p) =>
									p.published ? setPostToUnpublish(p) : setPostToPublish(p)
								}
								onDelete={setPostToDelete}
							/>
						))}
					</ul>
				)}
			</div>

			{/* Soft Delete Modal */}
			<AlertDialog
				open={!!postToDelete}
				onOpenChange={(open) => !open && setPostToDelete(null)}
			>
				<AlertDialogContent className="border-white/10 bg-[#0d1526] text-white">
					<AlertDialogHeader>
						<AlertDialogTitle>Move to trash?</AlertDialogTitle>
						<AlertDialogDescription className="text-zinc-400">
							This post will be moved to the trash and removed from the live
							site. You can restore it later.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="border-white/10 bg-transparent text-white hover:bg-white/5">
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => postToDelete && executeDelete(postToDelete)}
							className="bg-red-500/80 text-white hover:bg-red-500"
						>
							Move to Trash
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Hard Delete Modal */}
			<AlertDialog
				open={!!postToHardDelete}
				onOpenChange={(open) => !open && setPostToHardDelete(null)}
			>
				<AlertDialogContent className="border-white/10 bg-[#0d1526] text-white">
					<AlertDialogHeader>
						<AlertDialogTitle>Permanently delete?</AlertDialogTitle>
						<AlertDialogDescription className="text-zinc-400">
							This action cannot be undone. This will permanently remove the
							post from the database.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="border-white/10 bg-transparent text-white hover:bg-white/5">
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() =>
								postToHardDelete && executeHardDelete(postToHardDelete)
							}
							className="bg-red-500/80 text-white hover:bg-red-500"
						>
							Permanently Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Publish Modal */}
			<AlertDialog
				open={!!postToPublish}
				onOpenChange={(open) => !open && setPostToPublish(null)}
			>
				<AlertDialogContent className="border-white/10 bg-[#0d1526] text-white">
					<AlertDialogHeader>
						<AlertDialogTitle>Ready to publish?</AlertDialogTitle>
						<AlertDialogDescription className="text-zinc-400">
							You are about to publish "{postToPublish?.title}". Are you ready
							for this to go live?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="border-white/10 bg-transparent text-white hover:bg-white/5">
							Review again
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() =>
								postToPublish && executeToggle(postToPublish.id, false)
							}
							className="bg-white text-black hover:bg-zinc-200"
						>
							Yes, publish it
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Unpublish Modal */}
			<AlertDialog
				open={!!postToUnpublish}
				onOpenChange={(open) => !open && setPostToUnpublish(null)}
			>
				<AlertDialogContent className="border-white/10 bg-[#0d1526] text-white">
					<AlertDialogHeader>
						<AlertDialogTitle>Unpublish this post?</AlertDialogTitle>
						<AlertDialogDescription className="text-zinc-400">
							Are you sure you want to unpublish this post? It will be moved to
							your Drafts and immediately removed from the live site.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="border-white/10 bg-transparent text-white hover:bg-white/5">
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() =>
								postToUnpublish && executeToggle(postToUnpublish.id, true)
							}
							className="bg-amber-500/80 text-white hover:bg-amber-500"
						>
							Yes, unpublish
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
