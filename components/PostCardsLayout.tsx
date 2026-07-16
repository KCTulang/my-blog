"use client";

import parse from "html-react-parser";
import { useState } from "react";

interface PostCardsLayoutProps {
	post: { title: string; createdAt: Date; body: string };
	commentsNode: React.ReactNode;
	commentFormNode: React.ReactNode;
	morePostsNode: React.ReactNode;
}

export default function PostCardsLayout({
	post,
	commentsNode,
	commentFormNode,
	morePostsNode,
}: PostCardsLayoutProps) {
	const [isLight, setIsLight] = useState(false);

	return (
		<div
			className={`group flex flex-col lg:flex-row gap-8 lg:gap-16 items-start w-full transition-colors duration-300 ${isLight ? "light-cards" : ""}`}
		>
			{/* Article */}
			<article
				className={`flex-1 w-full lg:max-w-4xl rounded-3xl border p-6 sm:p-10 lg:p-12 relative transition-colors duration-300 ${
					isLight
						? "bg-[#fafafa] text-zinc-800 border-black/10 shadow-sm"
						: "card-glass-dim border-white/10"
				}`}
			>
				<button
					type="button"
					onClick={() => setIsLight(!isLight)}
					className={`absolute top-6 right-6 p-2 rounded-full border text-sm transition-colors duration-200 flex items-center justify-center min-h-11 min-w-11 z-10 ${
						isLight
							? "border-zinc-200 hover:bg-zinc-100 text-zinc-600"
							: "border-white/10 hover:bg-white/5 text-zinc-300"
					}`}
					aria-label="Toggle Theme"
					title="Toggle post brightness"
				>
					{isLight ? "🌙" : "☀️"}
				</button>

				<h1
					className={`mb-3 font-serif text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl pr-12 ${
						isLight ? "text-zinc-900" : "text-white"
					}`}
				>
					{post.title}
				</h1>
				<time
					dateTime={post.createdAt.toISOString()}
					className={`mb-8 block text-sm ${isLight ? "text-zinc-500" : "text-zinc-500"}`}
				>
					{post.createdAt.toLocaleDateString("en-US", {
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</time>

				<div
					className={`prose max-w-none prose-p:leading-relaxed prose-headings:font-serif prose-ul:list-disc prose-ol:list-decimal prose-ul:pl-6 prose-ol:pl-6 prose-li:my-1 ${
						isLight
							? "text-zinc-800 prose-p:text-zinc-800 prose-headings:text-zinc-900 prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-strong:text-zinc-900 prose-li:text-zinc-800"
							: "text-zinc-300 prose-p:text-zinc-300 prose-headings:text-white prose-a:text-light-blue hover:prose-a:text-white prose-strong:text-white prose-li:text-zinc-300"
					}`}
				>
					{parse(post.body)}
				</div>
			</article>

			{/* Sidebar */}
			<div className="w-full lg:w-[320px] xl:w-95 shrink-0 flex flex-col gap-10 lg:sticky lg:top-32">
				{/* Comments Wrapper */}
				<div
					className={`rounded-3xl border p-6 sm:p-8 flex flex-col gap-8 transition-colors duration-300 ${
						isLight
							? "bg-[#fafafa] border-black/10 shadow-sm"
							: "card-glass-dim border-white/10"
					}`}
				>
					<section>
						<h2
							className={`mb-6 font-serif text-xl font-semibold transition-colors ${isLight ? "text-zinc-900" : "text-white"}`}
						>
							Comments
						</h2>
						{commentsNode}
					</section>
					{commentFormNode}
				</div>

				<hr
					className={`block lg:hidden my-2 transition-colors ${isLight ? "border-black/10" : "border-white/10"}`}
				/>

				{/* More Posts Wrapper */}
				<section
					className={`rounded-3xl border p-6 sm:p-8 transition-colors duration-300 ${
						isLight
							? "bg-[#fafafa] border-black/10 shadow-sm"
							: "card-glass-dim border-white/10"
					}`}
				>
					<h2
						className={`mb-5 font-serif text-xl font-semibold transition-colors ${isLight ? "text-zinc-900" : "text-white"}`}
					>
						More Posts
					</h2>
					{morePostsNode}
				</section>
			</div>
		</div>
	);
}
