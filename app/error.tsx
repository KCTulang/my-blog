"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import FadeInUp from "@/components/FadeInUp";

export default function ErrorBoundary({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Application Error Caught by Boundary:", error);
	}, [error]);

	return (
		<div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden min-h-[80vh] px-6">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 z-0"
				style={{
					background:
						"radial-gradient(circle at 50% 50%, rgba(22,40,90,0.3) 0%, transparent 60%)",
				}}
			/>

			<main className="relative z-10 w-full max-w-2xl text-center">
				<FadeInUp>
					<div className="flex flex-col items-center card-glass-dim rounded-3xl border border-white/10 p-10 sm:p-14 shadow-xl">
						<div className="mb-8 relative h-32 w-32 sm:h-40 sm:w-40 opacity-80">
							<Image
								src="/Moon.svg"
								alt=""
								aria-hidden="true"
								fill
								className="object-contain"
							/>
						</div>

						<h1 className="mb-4 font-serif text-4xl sm:text-5xl font-semibold text-white">
							Oops, something broke!
						</h1>

						<p className="mb-10 text-base sm:text-lg font-light leading-relaxed text-zinc-300 max-w-md mx-auto">
							We've encountered an unexpected error while trying to load this
							page. Don't worry, the moon is still shining.
						</p>

						<div className="flex flex-wrap items-center justify-center gap-4">
							<button
								type="button"
								onClick={() => reset()}
								className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-8 py-4 text-sm font-semibold tracking-wide text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
							>
								Try Again ↺
							</button>
							<Link
								href="/"
								className="inline-flex items-center justify-center rounded-full border border-white/10 bg-transparent px-8 py-4 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:bg-white/5"
							>
								Return Home
							</Link>
						</div>
					</div>
				</FadeInUp>
			</main>
		</div>
	);
}
