"use client";

import { useState } from "react";
import CommentForm from "@/components/CommentForm";

type Comment = {
	id: string;
	parentId: string | null;
	authorName: string;
	body: string;
	createdAt: Date;
};

export default function UserCommentList({
	comments,
	postId,
	slug,
}: {
	comments: Comment[];
	postId: string;
	slug: string;
}) {
	const [replyingTo, setReplyingTo] = useState<string | null>(null);

	type CommentTreeNode = Comment & { children: CommentTreeNode[] };

	const buildTreeAndFlatten = (list: Comment[]) => {
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
		const flatWithLevel: (Comment & { level: number })[] = [];
		const traverse = (nodes: CommentTreeNode[], level: number) => {
			nodes.forEach((node) => {
				flatWithLevel.push({ ...node, level });
				traverse(node.children, level + 1);
			});
		};
		traverse(roots, 0);
		return flatWithLevel;
	};

	const commentsToRender = buildTreeAndFlatten(comments);

	if (comments.length === 0) {
		return (
			<p className="text-sm text-zinc-500 italic">
				No comments yet. Be the first to share your thoughts!
			</p>
		);
	}

	return (
		<ul className="flex flex-col gap-4">
			{commentsToRender.map((c) => (
				<li
					key={c.id}
					className="card-glass-faint group-[.light-cards]:bg-white group-[.light-cards]:shadow-sm rounded-xl border border-white/10 group-[.light-cards]:border-black/10 px-4 py-4 sm:px-5 transition-all"
					style={{ marginLeft: `${Math.min(c.level, 5) * 2}rem` }}
				>
					<p className="mb-1 text-sm font-semibold text-white group-[.light-cards]:text-zinc-900 transition-colors">
						{c.authorName}
					</p>
					<p className="wrap-break-word text-sm font-light leading-relaxed text-zinc-400 group-[.light-cards]:text-zinc-600 transition-colors">
						{c.body}
					</p>
					<div className="mt-2 flex items-center justify-between">
						<time
							dateTime={new Date(c.createdAt).toISOString()}
							className="block text-xs text-zinc-600 group-[.light-cards]:text-zinc-400 transition-colors"
						>
							{new Date(c.createdAt).toLocaleDateString("en-US", {
								year: "numeric",
								month: "short",
								day: "numeric",
							})}
						</time>
						<button
							type="button"
							onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
							className="text-xs text-zinc-400 hover:text-white group-[.light-cards]:text-zinc-500 group-[.light-cards]:hover:text-zinc-800 transition-colors"
						>
							Reply
						</button>
					</div>

					{replyingTo === c.id && (
						<div className="mt-4">
							<CommentForm
								postId={postId}
								slug={slug}
								parentId={c.id}
								onCancel={() => setReplyingTo(null)}
							/>
						</div>
					)}
				</li>
			))}
		</ul>
	);
}
