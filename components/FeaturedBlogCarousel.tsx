"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";

// Types

export interface BlogPost {
	id: string;
	title: string;
	/** Short excerpt shown on the card */
	excerpt: string;
	slug: string;
}

interface FeaturedBlogCarouselProps {
	posts: BlogPost[];
}

// Component

export default function FeaturedBlogCarousel({
	posts,
}: FeaturedBlogCarouselProps) {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);

	// Sync Embla state → React state and handle autoplay
	useEffect(() => {
		if (!api) return;
		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap());

		const onSelect = () => setCurrent(api.selectedScrollSnap());
		api.on("select", onSelect);

		// Autoplay interval
		const interval = setInterval(() => {
			if (api.canScrollNext()) {
				api.scrollNext();
			} else {
				api.scrollTo(0);
			}
		}, 5000);

		return () => {
			api.off("select", onSelect);
			clearInterval(interval);
		};
	}, [api]);

	const scrollTo = useCallback(
		(index: number) => {
			api?.scrollTo(index);
		},
		[api],
	);

	// Guard: render single static card when no real data
	if (posts.length === 0) {
		return <PlaceholderCarousel />;
	}

	return (
		<div className="w-full">
			<Carousel
				setApi={setApi}
				opts={{
					align: "center",
					loop: posts.length > 1,
					dragFree: false,
				}}
				className="w-full"
				aria-label="Featured blog posts"
			>
				<CarouselContent className="ml-0">
					{posts.map((post) => (
						<CarouselItem key={post.id} className="pl-0">
							<PostCard post={post} />
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>

			{/* Dot pagination */}
			{count > 1 && (
				<div
					role="tablist"
					aria-label="Slide navigation"
					className="mt-4 flex items-center justify-center gap-1.75"
				>
					{posts.slice(0, count).map((post, i) => (
						<button
							key={post.id}
							type="button"
							role="tab"
							aria-label={`Go to slide ${i + 1}`}
							aria-selected={i === current}
							onClick={() => scrollTo(i)}
							className={`h-1.5 rounded-full transition-all duration-300 ${
								i === current
									? "w-5 bg-white/70"
									: "w-1.5 bg-white/20 hover:bg-white/40"
							}`}
						/>
					))}
				</div>
			)}
		</div>
	);
}

//  Sub-comonents

function PostCard({ post }: { post: BlogPost }) {
	return (
		<Link
			href={`/blog/${post.slug}`}
			className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-[1.75rem] lg:rounded-[2rem]"
			tabIndex={0}
		>
			<article className="card-glass relative z-10 rounded-[1.5rem] px-5 py-5 text-center transition-colors duration-200 sm:rounded-[1.75rem] sm:px-8 sm:py-7 lg:rounded-[2rem] lg:px-10 lg:py-8">
				<h2
					className="mb-2.5 font-serif font-semibold text-white
						text-[17px] lg:text-[19px]
						group-hover:text-white/90 transition-colors duration-200"
				>
					{post.title}
				</h2>
				<p
					className="font-sans font-light text-zinc-400
						text-[13px] lg:text-[13.5px]"
				>
					{post.excerpt}
				</p>
			</article>
		</Link>
	);
}

export function PlaceholderCarousel() {
	return (
		<article className="card-glass relative z-10 rounded-[1.5rem] px-5 py-5 text-center sm:rounded-[1.75rem] sm:px-8 sm:py-7 lg:rounded-[2rem] lg:px-10 lg:py-8">
			<h2 className="mb-2.5 font-serif text-[17px] font-semibold text-white lg:text-[19px]">
				Blog Title
			</h2>
			<p className="font-sans text-[13px] font-light text-zinc-400 lg:text-[13.5px]">
				Blog content...
			</p>
		</article>
	);
}
