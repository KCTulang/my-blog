"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export default function TagFilterBar({
	tags,
	activeTag,
}: {
	tags: string[];
	activeTag?: string;
}) {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);

	const checkScrollability = useCallback(() => {
		if (scrollContainerRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } =
				scrollContainerRef.current;
			setCanScrollLeft(scrollLeft > 0);
			setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
		}
	}, []);

	useEffect(() => {
		checkScrollability();
		window.addEventListener("resize", checkScrollability);
		return () => window.removeEventListener("resize", checkScrollability);
	}, [checkScrollability]);

	const scroll = (direction: "left" | "right") => {
		if (scrollContainerRef.current) {
			const scrollAmount = 200;
			scrollContainerRef.current.scrollBy({
				left: direction === "left" ? -scrollAmount : scrollAmount,
				behavior: "smooth",
			});
		}
	};

	if (tags.length === 0) return null;

	return (
		<div className="relative mb-8 -mx-1 flex items-center group">
			{canScrollLeft && (
				<div className="absolute left-0 z-10 h-full flex items-center bg-gradient-to-r from-[#030712] via-[#030712]/80 to-transparent pr-4 pl-1 pointer-events-none">
					<button
						type="button"
						onClick={() => scroll("left")}
						className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white shadow-md backdrop-blur-md transition-all"
						aria-label="Scroll left"
					>
						<ChevronLeft size={16} />
					</button>
				</div>
			)}

			<div
				ref={scrollContainerRef}
				onScroll={checkScrollability}
				className="overflow-x-auto scrollbar-hide w-full flex-1"
			>
				<div className="flex min-w-max gap-2 px-1 pb-1">
					<Link
						href="/blog"
						className={`tag-pill ${!activeTag ? "tag-pill-active" : ""}`}
					>
						All
					</Link>
					{tags.map((tag) => (
						<Link
							key={tag}
							href={`/blog?tag=${encodeURIComponent(tag)}`}
							className={`tag-pill ${activeTag === tag ? "tag-pill-active" : ""}`}
						>
							{tag}
						</Link>
					))}
				</div>
			</div>

			{canScrollRight && (
				<div className="absolute right-0 z-10 h-full flex items-center bg-gradient-to-l from-[#030712] via-[#030712]/80 to-transparent pl-4 pr-1 pointer-events-none">
					<button
						type="button"
						onClick={() => scroll("right")}
						className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white shadow-md backdrop-blur-md transition-all"
						aria-label="Scroll right"
					>
						<ChevronRight size={16} />
					</button>
				</div>
			)}
		</div>
	);
}
