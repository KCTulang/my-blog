"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface BlogPostCardProps {
	post: {
		id: string;
		slug: string;
		title: string;
		createdAt: Date;
		body: string;
		tags: string[];
	};
	commentCountSlot: ReactNode;
}

export default function BlogPostCard({
	post,
	commentCountSlot,
}: BlogPostCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.2 }}
		>
			<Link
				href={`/blog/${post.slug}`}
				className="card-glass-dim group block rounded-2xl border border-white/10 px-5 py-5 transition-all duration-200 hover:border-white/20 sm:px-7 sm:py-6"
			>
				{/* Title — min-w-0 prevents flex overflow on narrow columns */}
				<h2 className="mb-1 min-w-0 truncate font-serif text-lg font-semibold text-white transition-colors duration-200 group-hover:text-white/90 sm:text-xl sm:whitespace-normal sm:overflow-visible">
					{post.title}
				</h2>
				<time
					dateTime={post.createdAt.toISOString()}
					className="mb-3 block text-xs text-zinc-500"
				>
					{new Date(post.createdAt).toLocaleDateString("en-US", {
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</time>
				{/* Excerpt — 3 lines on mobile, uncapped on sm+ */}
				<p className="line-clamp-3 text-sm font-light leading-relaxed text-zinc-400 sm:line-clamp-none">
					{post.body.length > 160
						? `${post.body.substring(0, 160)}…`
						: post.body}
				</p>

				{/* Tags */}
				{post.tags.length > 0 && (
					<div className="mt-3 flex flex-wrap gap-1.5">
						{post.tags.map((t) => (
							<span key={t} className="tag-pill tag-pill-sm">
								{t}
							</span>
						))}
					</div>
				)}

				{/* Footer row */}
				<div className="mt-4 flex items-center justify-between">
					<span className="min-h-11 flex items-center text-xs font-semibold text-white/50 transition-colors duration-200 group-hover:text-white/70">
						Read more →
					</span>
					{commentCountSlot}
				</div>
			</Link>
		</motion.div>
	);
}
