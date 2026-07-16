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
	addComment,
	bulkApproveComments,
	bulkDeleteComments,
	bulkHardDeleteComments,
	bulkRestoreComments,
	toggleCommentApproval,
} from "@/lib/actions";

type CommentWithPost = {
	id: string;
	parentId: string | null;
	authorName: string;
	body: string;
	approved: boolean;
	createdAt: Date;
	deletedAt: Date | null;
	post: { id: string; title: string; slug: string };
};

function CommentRow({
	comment,
	level = 0,
	isSelected,
	onToggleSelect,
	onRestore,
	onHardDelete,
	onToggleApprove,
	onDelete,
	replyingTo,
	onSetReplyingTo,
}: {
	comment: CommentWithPost;
	level?: number;
	isSelected: boolean;
	onToggleSelect: (id: string) => void;
	onRestore: (id: string) => void;
	onHardDelete: (id: string) => void;
	onToggleApprove: (id: string, current: boolean) => void;
	onDelete: (id: string) => void;
	replyingTo: string | null;
	onSetReplyingTo: (id: string | null) => void;
}) {
	return (
		<li
			className={`card-glass flex flex-col gap-3 rounded-2xl border ${
				isSelected ? "border-white/30" : "border-white/10"
			} px-5 py-5 transition-all`}
			style={{ marginLeft: `${Math.min(level, 5) * 2}rem` }}
		>
			<div className="flex items-start gap-3">
				<input
					type="checkbox"
					checked={isSelected}
					onChange={() => onToggleSelect(comment.id)}
					className="mt-1 h-4 w-4 shrink-0 rounded border-white/20 bg-white/10 accent-white"
				/>
				<div className="flex w-full flex-col gap-3">
					{/* Meta Header */}
					<div className="flex flex-wrap items-center gap-x-4 gap-y-1">
						<span className="text-sm font-semibold text-white">
							{comment.authorName}
						</span>
						<span
							className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
								comment.deletedAt
									? "bg-red-500/15 text-red-400"
									: comment.approved
										? "bg-green-500/15 text-green-400"
										: "bg-amber-500/15 text-amber-400"
							}`}
						>
							{comment.deletedAt
								? "Trashed"
								: comment.approved
									? "Approved"
									: "Pending"}
						</span>
						<Link
							href={`/blog/${comment.post.slug}`}
							className="text-xs text-zinc-500 transition-colors hover:text-zinc-300"
						>
							→ {comment.post.title}
						</Link>
						<time
							dateTime={comment.createdAt.toISOString()}
							className="ml-auto text-xs text-zinc-600"
						>
							{new Date(comment.createdAt).toLocaleDateString()}
						</time>
					</div>

					{/* Body */}
					<p className="wrap-break-word text-sm font-light leading-relaxed text-zinc-300">
						{comment.body}
					</p>

					{/* Actions & Reply Form */}
					<div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
						<div className="flex items-center gap-2">
							{comment.deletedAt ? (
								<>
									<button
										type="button"
										onClick={() => onRestore(comment.id)}
										className="min-h-9 rounded border border-white/10 bg-white/5 px-3 text-xs font-medium text-white transition-colors hover:bg-white/15"
									>
										Restore
									</button>
									<button
										type="button"
										onClick={() => onHardDelete(comment.id)}
										className="min-h-9 rounded border border-white/10 bg-white/5 px-3 text-xs font-medium text-red-400 transition-colors hover:bg-white/15"
									>
										Permanently Delete
									</button>
								</>
							) : (
								<>
									<button
										type="button"
										onClick={() =>
											onToggleApprove(comment.id, comment.approved)
										}
										className="min-h-9 rounded border border-white/10 bg-white/5 px-3 text-xs font-medium text-white transition-colors hover:bg-white/15"
									>
										{comment.approved ? "Unapprove" : "Approve"}
									</button>
									<button
										type="button"
										onClick={() => onDelete(comment.id)}
										className="min-h-9 rounded border border-white/10 bg-white/5 px-3 text-xs font-medium text-red-400 transition-colors hover:bg-white/15"
									>
										Delete
									</button>
									<button
										type="button"
										onClick={() =>
											onSetReplyingTo(
												replyingTo === comment.id ? null : comment.id,
											)
										}
										className="min-h-9 rounded border border-white/10 bg-white/5 px-3 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/15"
									>
										{replyingTo === comment.id ? "Cancel Reply" : "Reply"}
									</button>
								</>
							)}
						</div>
					</div>

					{/* Inline Reply Form */}
					{replyingTo === comment.id && !comment.deletedAt && (
						<form
							className="mt-3 flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
							action={async (formData) => {
								const res = await addComment({ success: false }, formData);
								if (res.success) {
									onSetReplyingTo(null);
									toast.success("Reply posted successfully.");
									window.location.reload();
								} else {
									toast.error(
										res.errors?.body?.[0] ||
											res.errors?._form?.[0] ||
											"Failed to post reply.",
									);
								}
							}}
						>
							<input type="hidden" name="postId" value={comment.post.id} />
							<input type="hidden" name="slug" value={comment.post.slug} />
							<input type="hidden" name="parentId" value={comment.id} />
							<input type="hidden" name="authorName" value="Admin" />
							<textarea
								name="body"
								required
								rows={3}
								placeholder="Write your reply as Admin..."
								className="w-full resize-y rounded border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20"
							/>
							<div className="flex justify-end">
								<button
									type="submit"
									className="min-h-9 rounded bg-white/15 px-4 text-xs font-medium text-white transition-colors hover:bg-white/25"
								>
									Post Reply
								</button>
							</div>
						</form>
					)}
				</div>
			</div>
		</li>
	);
}

export default function AdminCommentList({
	initialComments,
}: {
	initialComments: CommentWithPost[];
}) {
	const [comments, setComments] = useState(initialComments);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [filterStatus, setFilterStatus] = useState<
		"all" | "pending" | "approved" | "trashed"
	>("all");
	const [filterPost, setFilterPost] = useState<string>("all");
	const [replyingTo, setReplyingTo] = useState<string | null>(null);

	const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
	const [commentToHardDelete, setCommentToHardDelete] = useState<string | null>(
		null,
	);
	const [isBulkDeleting, setIsBulkDeleting] = useState(false);
	const [isBulkHardDeleting, setIsBulkHardDeleting] = useState(false);

	// Keep track of pending timeouts to allow cleanup if component unmounts
	const pendingTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});

	useEffect(() => {
		return () => {
			Object.values(pendingTimeouts.current).forEach(clearTimeout);
		};
	}, []);

	// Get unique posts for filter dropdown
	const uniquePosts = Array.from(
		new Map(comments.map((c) => [c.post.slug, c.post])).values(),
	);

	const matchesStatusFilter = (comment: (typeof comments)[0]) => {
		if (filterStatus === "trashed") return !!comment.deletedAt;
		if (comment.deletedAt) return false;
		if (filterStatus === "pending") return !comment.approved;
		if (filterStatus === "approved") return comment.approved;
		return true;
	};

	const matchesPostFilter = (comment: (typeof comments)[0]) => {
		return filterPost === "all" || comment.post.slug === filterPost;
	};

	const filteredComments = comments.filter(
		(c) => matchesStatusFilter(c) && matchesPostFilter(c),
	);

	type CommentTreeNode = CommentWithPost & { children: CommentTreeNode[] };

	const buildTreeAndFlatten = (list: CommentWithPost[]) => {
		const map = new Map<string, CommentTreeNode>();
		list.forEach((c) => {
			map.set(c.id, { ...c, children: [] });
		});
		const roots: CommentTreeNode[] = [];
		list.forEach((c) => {
			if (c.parentId && map.has(c.parentId)) {
				const parent = map.get(c.parentId);
				const child = map.get(c.id);
				if (parent && child) {
					parent.children.push(child);
				}
			} else {
				const child = map.get(c.id);
				if (child) {
					roots.push(child);
				}
			}
		});
		const flatWithLevel: (CommentWithPost & { level: number })[] = [];
		const traverse = (nodes: CommentTreeNode[], level: number) => {
			nodes.forEach((node) => {
				flatWithLevel.push({ ...node, level });
				traverse(node.children, level + 1);
			});
		};
		traverse(roots, 0);
		return flatWithLevel;
	};

	const commentsToRender = buildTreeAndFlatten(filteredComments);

	const toggleSelection = (id: string) => {
		const newSet = new Set(selectedIds);
		if (newSet.has(id)) newSet.delete(id);
		else newSet.add(id);
		setSelectedIds(newSet);
	};

	const selectAll = () => {
		if (selectedIds.size === filteredComments.length) {
			setSelectedIds(new Set());
		} else {
			setSelectedIds(new Set(filteredComments.map((c) => c.id)));
		}
	};

	const handleBulkApprove = () => {
		if (selectedIds.size === 0) return;
		const ids = Array.from(selectedIds);

		const commentsToRestore = comments.filter((c) => ids.includes(c.id));

		// Optimistic update
		setComments((current) =>
			current.map((c) => (ids.includes(c.id) ? { ...c, approved: true } : c)),
		);
		setSelectedIds(new Set());

		let executed = false;
		const timeoutKey = `bulk-approve-${Date.now()}`;

		const timeoutId = setTimeout(async () => {
			executed = true;
			try {
				await bulkApproveComments(ids);
			} catch {
				// Revert on error
				setComments((current) =>
					current.map((c) => {
						const original = commentsToRestore.find((orig) => orig.id === c.id);
						return original ? { ...c, approved: original.approved } : c;
					}),
				);
				toast.error("Bulk approve failed");
			}
			delete pendingTimeouts.current[timeoutKey];
		}, 5000);

		pendingTimeouts.current[timeoutKey] = timeoutId;

		toast(`${ids.length} Comments Approved`, {
			action: {
				label: "Undo",
				onClick: () => {
					if (executed) return;
					clearTimeout(timeoutId);
					delete pendingTimeouts.current[timeoutKey];
					// Revert optimistic update
					setComments((current) =>
						current.map((c) => {
							const original = commentsToRestore.find(
								(orig) => orig.id === c.id,
							);
							return original ? { ...c, approved: original.approved } : c;
						}),
					);
				},
			},
			duration: 5000,
		});
	};

	const handleBulkRestore = async () => {
		const ids = Array.from(selectedIds);
		if (ids.length === 0) return;

		// Optimistic update
		setComments((current) =>
			current.map((c) => (ids.includes(c.id) ? { ...c, deletedAt: null } : c)),
		);
		setSelectedIds(new Set());

		try {
			await bulkRestoreComments(ids);
			toast.success(`${ids.length} Comments Restored`);
		} catch {
			// Revert on error
			setComments((current) =>
				current.map((c) =>
					ids.includes(c.id) ? { ...c, deletedAt: new Date() } : c,
				),
			);
			toast.error("Bulk restore failed");
		}
	};

	const executeBulkDelete = () => {
		const ids = Array.from(selectedIds);
		if (ids.length === 0) return;

		const commentsToRestore = comments.filter((c) => ids.includes(c.id));

		// Optimistic soft delete
		setComments((current) =>
			current.map((c) =>
				ids.includes(c.id) ? { ...c, deletedAt: new Date() } : c,
			),
		);
		setSelectedIds(new Set());
		setIsBulkDeleting(false);

		let executed = false;
		const timeoutKey = `bulk-delete-${Date.now()}`;

		const timeoutId = setTimeout(async () => {
			executed = true;
			try {
				await bulkDeleteComments(ids);
			} catch {
				setComments((current) =>
					current.map((c) => {
						const original = commentsToRestore.find((orig) => orig.id === c.id);
						return original ? { ...c, deletedAt: original.deletedAt } : c;
					}),
				);
				toast.error("Bulk delete failed");
			}
			delete pendingTimeouts.current[timeoutKey];
		}, 5000);

		pendingTimeouts.current[timeoutKey] = timeoutId;

		toast(`${ids.length} Comments Trashed`, {
			action: {
				label: "Undo",
				onClick: () => {
					if (executed) return;
					clearTimeout(timeoutId);
					delete pendingTimeouts.current[timeoutKey];
					setComments((current) =>
						current.map((c) => {
							const original = commentsToRestore.find(
								(orig) => orig.id === c.id,
							);
							return original ? { ...c, deletedAt: original.deletedAt } : c;
						}),
					);
				},
			},
			duration: 5000,
		});
	};

	const executeBulkHardDelete = async () => {
		const ids = Array.from(selectedIds);
		if (ids.length === 0) return;

		const commentsToRestore = comments.filter((c) => ids.includes(c.id));

		// Optimistic hard delete
		setComments((current) => current.filter((c) => !ids.includes(c.id)));
		setSelectedIds(new Set());
		setIsBulkHardDeleting(false);

		try {
			await bulkHardDeleteComments(ids);
			toast.success(`${ids.length} comments permanently deleted`);
		} catch {
			setComments((current) =>
				[...current, ...commentsToRestore].sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
				),
			);
			toast.error("Bulk hard delete failed");
		}
	};

	const handleToggleApprove = (id: string, current: boolean) => {
		setComments((currentList) =>
			currentList.map((c) => (c.id === id ? { ...c, approved: !current } : c)),
		);

		const actionName = !current ? "Approved" : "Unapproved";
		let executed = false;
		const timeoutKey = `toggle-${id}`;

		const timeoutId = setTimeout(async () => {
			executed = true;
			try {
				await toggleCommentApproval(id, current);
			} catch {
				setComments((currentList) =>
					currentList.map((c) =>
						c.id === id ? { ...c, approved: current } : c,
					),
				);
				toast.error("Toggle failed");
			}
			delete pendingTimeouts.current[timeoutKey];
		}, 5000);

		pendingTimeouts.current[timeoutKey] = timeoutId;

		toast(`Comment ${actionName}`, {
			action: {
				label: "Undo",
				onClick: () => {
					if (executed) return;
					clearTimeout(timeoutId);
					delete pendingTimeouts.current[timeoutKey];
					setComments((currentList) =>
						currentList.map((c) =>
							c.id === id ? { ...c, approved: current } : c,
						),
					);
				},
			},
			duration: 5000,
		});
	};

	const executeDelete = (id: string) => {
		const commentToRestore = comments.find((c) => c.id === id);
		if (!commentToRestore) return;

		// Optimistic soft delete
		setComments((current) =>
			current.map((c) => (c.id === id ? { ...c, deletedAt: new Date() } : c)),
		);
		setCommentToDelete(null);

		let executed = false;
		const timeoutKey = `delete-${id}`;

		const timeoutId = setTimeout(async () => {
			executed = true;
			try {
				await bulkDeleteComments([id]);
			} catch {
				setComments((current) =>
					current.map((c) => (c.id === id ? { ...c, deletedAt: null } : c)),
				);
				toast.error("Delete failed");
			}
			delete pendingTimeouts.current[timeoutKey];
		}, 5000);

		pendingTimeouts.current[timeoutKey] = timeoutId;

		toast("Comment Trashed", {
			action: {
				label: "Undo",
				onClick: () => {
					if (executed) return;
					clearTimeout(timeoutId);
					delete pendingTimeouts.current[timeoutKey];
					setComments((current) =>
						current.map((c) => (c.id === id ? { ...c, deletedAt: null } : c)),
					);
				},
			},
			duration: 5000,
		});
	};

	const executeRestore = async (id: string) => {
		// Optimistic restore
		setComments((current) =>
			current.map((c) => (c.id === id ? { ...c, deletedAt: null } : c)),
		);

		try {
			await bulkRestoreComments([id]);
			toast.success("Comment restored");
		} catch {
			setComments((current) =>
				current.map((c) => (c.id === id ? { ...c, deletedAt: new Date() } : c)),
			);
			toast.error("Restore failed");
		}
	};

	const executeHardDelete = async (id: string) => {
		const commentToRestore = comments.find((c) => c.id === id);
		if (!commentToRestore) return;

		// Optimistic hard delete
		setComments((current) => current.filter((c) => c.id !== id));
		setCommentToHardDelete(null);

		try {
			await bulkHardDeleteComments([id]);
			toast.success("Comment permanently deleted");
		} catch {
			setComments((current) =>
				[...current, commentToRestore].sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
				),
			);
			toast.error("Delete failed");
		}
	};

	return (
		<>
			<div className="flex flex-col gap-6">
				{/* Filters & Bulk Actions */}
				<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
					<div className="flex flex-1 items-center gap-3">
						<select
							value={filterStatus}
							onChange={(e) =>
								setFilterStatus(
									e.target.value as "all" | "approved" | "pending" | "trashed",
								)
							}
							className="rounded-xl border border-white/10 bg-[#0d1526] px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-white/20"
						>
							<option value="all">All Status</option>
							<option value="pending">Pending</option>
							<option value="approved">Approved</option>
							<option value="trashed">Trashed</option>
						</select>
						<select
							value={filterPost}
							onChange={(e) => setFilterPost(e.target.value)}
							className="max-w-50 rounded-xl border border-white/10 bg-[#0d1526] px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-white/20"
						>
							<option value="all">All Posts</option>
							{uniquePosts.map((p) => (
								<option key={p.slug} value={p.slug}>
									{p.title}
								</option>
							))}
						</select>
					</div>

					<div className="flex items-center gap-2">
						<span className="text-sm text-zinc-500">
							{selectedIds.size} selected
						</span>
						{filterStatus === "trashed" ? (
							<>
								<button
									type="button"
									onClick={handleBulkRestore}
									disabled={selectedIds.size === 0}
									className="min-h-11 rounded-lg border border-white/10 bg-white/5 px-3 text-sm font-medium text-white transition-colors hover:bg-white/15 disabled:opacity-50 sm:min-h-9"
								>
									Restore
								</button>
								<button
									type="button"
									onClick={() => setIsBulkHardDeleting(true)}
									disabled={selectedIds.size === 0}
									className="min-h-11 rounded-lg border border-red-500/20 bg-red-500/10 px-3 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50 sm:min-h-9"
								>
									Permanently Delete
								</button>
							</>
						) : (
							<>
								<button
									type="button"
									onClick={handleBulkApprove}
									disabled={selectedIds.size === 0}
									className="min-h-11 rounded-lg border border-white/10 bg-white/5 px-3 text-sm font-medium text-white transition-colors hover:bg-white/15 disabled:opacity-50 sm:min-h-9"
								>
									Approve
								</button>
								<button
									type="button"
									onClick={() => setIsBulkDeleting(true)}
									disabled={selectedIds.size === 0}
									className="min-h-11 rounded-lg border border-red-500/20 bg-red-500/10 px-3 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50 sm:min-h-9"
								>
									Delete
								</button>
							</>
						)}
					</div>
				</div>

				{/* Comments List */}
				{filteredComments.length === 0 ? (
					<p className="text-zinc-500">No comments found.</p>
				) : (
					<div className="flex flex-col gap-4">
						<div className="flex items-center gap-3 px-2">
							<input
								type="checkbox"
								checked={
									selectedIds.size === filteredComments.length &&
									filteredComments.length > 0
								}
								onChange={selectAll}
								className="h-4 w-4 rounded border-white/20 bg-white/10 accent-white"
							/>
							<span className="text-sm text-zinc-400">Select all</span>
						</div>

						<ul className="flex flex-col gap-4">
							{commentsToRender.map((comment) => (
								<CommentRow
									key={comment.id}
									comment={comment}
									level={comment.level}
									isSelected={selectedIds.has(comment.id)}
									onToggleSelect={toggleSelection}
									onRestore={executeRestore}
									onHardDelete={setCommentToHardDelete}
									onToggleApprove={handleToggleApprove}
									onDelete={setCommentToDelete}
									replyingTo={replyingTo}
									onSetReplyingTo={setReplyingTo}
								/>
							))}
						</ul>
					</div>
				)}
			</div>

			<AlertDialog
				open={!!commentToDelete || isBulkDeleting}
				onOpenChange={(open) => {
					if (!open) {
						setCommentToDelete(null);
						setIsBulkDeleting(false);
					}
				}}
			>
				<AlertDialogContent className="border-white/10 bg-[#0d1526] text-white">
					<AlertDialogHeader>
						<AlertDialogTitle>Move to trash?</AlertDialogTitle>
						<AlertDialogDescription className="text-zinc-400">
							This action will move the selected{" "}
							{isBulkDeleting ? "comments" : "comment"} to the trash.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="border-white/10 bg-transparent text-white hover:bg-white/5">
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								if (isBulkDeleting) {
									executeBulkDelete();
								} else if (commentToDelete) {
									executeDelete(commentToDelete);
								}
							}}
							className="bg-red-500/80 text-white hover:bg-red-500"
						>
							Move to Trash
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog
				open={!!commentToHardDelete || isBulkHardDeleting}
				onOpenChange={(open) => {
					if (!open) {
						setCommentToHardDelete(null);
						setIsBulkHardDeleting(false);
					}
				}}
			>
				<AlertDialogContent className="border-white/10 bg-[#0d1526] text-white">
					<AlertDialogHeader>
						<AlertDialogTitle>Permanently delete?</AlertDialogTitle>
						<AlertDialogDescription className="text-zinc-400">
							This action cannot be undone. This will permanently delete the
							selected {isBulkHardDeleting ? "comments" : "comment"}.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="border-white/10 bg-transparent text-white hover:bg-white/5">
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								if (isBulkHardDeleting) {
									executeBulkHardDelete();
								} else if (commentToHardDelete) {
									executeHardDelete(commentToHardDelete);
								}
							}}
							className="bg-red-500/80 text-white hover:bg-red-500"
						>
							Permanently Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
