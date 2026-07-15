import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FadeInUp from "@/components/FadeInUp";
import FloatingElement from "@/components/FloatingElement";

export const metadata: Metadata = {
	title: "About — Loonary",
	description:
		"Meet the writer and the dachshund behind Loonary, a moonlit digital diary.",
};

export default function AboutPage() {
	return (
		<div className="relative flex flex-1 flex-col overflow-hidden">
			{/* Ambient glow */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 z-0"
				style={{
					background:
						"radial-gradient(ellipse 55% 45% at 50% 15%, rgba(22,40,90,0.3) 0%, transparent 70%)",
				}}
			/>

			<main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-6 pb-20 pt-28">
				<div className="mb-12 text-center lg:text-left">
					<h1 className="mb-2 font-serif text-4xl font-semibold text-white">
						About Loonary
					</h1>
					<p className="font-serif text-light-blue">a moonlit digital diary</p>
				</div>

				<div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-stretch">
					{/* ── LEFT COLUMN: CONTENT ── */}
					<div className="flex flex-1 flex-col w-full lg:max-w-2xl">
						<div className="flex flex-col gap-6">
							{/* ── ABOUT THE BLOG ── */}
							<FadeInUp delay={0.1}>
								<div className="card-glass-dim rounded-3xl border border-white/10 p-8 sm:p-10 transition-all duration-300 hover:border-white/20 hover:shadow-xl">
									<h2 className="mb-4 font-serif text-2xl font-semibold text-white">
										The Blog
									</h2>
									<p className="mb-4 text-sm font-light leading-relaxed text-zinc-400 sm:text-base">
										Loonary is a personal space for thoughts, stories, and
										reflections — written under the quiet glow of the moon.
										Inspired by a dachshund named Loona, it's equal parts diary,
										tech notes, and life musings.
									</p>
									<p className="text-sm font-light leading-relaxed text-zinc-400 sm:text-base">
										Built with Next.js, Neon Postgres, and Drizzle ORM as part
										of a full-stack capstone project — and designed to feel
										warm, calm, and a little bit magical.
									</p>
								</div>
							</FadeInUp>

							{/* ── ABOUT THE AUTHOR ── */}
							<FadeInUp delay={0.2} className="h-full">
								<div className="card-glass-dim h-full flex flex-col rounded-3xl border border-white/10 p-8 sm:p-10 transition-all duration-300 hover:-translate-y-2 hover:border-white/20 hover:shadow-xl">
									<h2 className="mb-4 font-serif text-2xl font-semibold text-white">
										The Writer
									</h2>
									<p className="text-sm font-light leading-relaxed text-zinc-400">
										Hi, I'm Kenneth Claire — a developer who writes code by day
										and stories by night. I built this blog to practice shipping
										real full-stack projects and to have a cozy corner of the
										internet to call my own.
									</p>
								</div>
							</FadeInUp>

							{/* ── ABOUT LOONA ── */}
							<FadeInUp delay={0.3} className="h-full">
								<div className="card-glass-dim h-full flex flex-col rounded-3xl border border-white/10 p-8 sm:p-10 transition-all duration-300 hover:-translate-y-2 hover:border-white/20 hover:shadow-xl">
									<h2 className="mb-4 font-serif text-2xl font-semibold text-white">
										The Dog
									</h2>
									<p className="text-sm font-light leading-relaxed text-zinc-400">
										Loona is a miniature dachshund and the true mascot of this
										blog. She doesn't write posts (yet), but she provides moral
										support, warmth, and the occasional dramatic sigh. The blog
										is named after her.
									</p>
								</div>
							</FadeInUp>
						</div>
					</div>

					{/* ── RIGHT COLUMN: LOONA IMAGE & EXTRAS ── */}
					<div className="flex w-full lg:w-1/2 flex-col gap-6 lg:justify-between">
						{/* Loona Image */}
						<div className="flex w-full justify-center">
							<FadeInUp className="w-full max-w-sm lg:max-w-md">
								<FloatingElement
									yOffset={15}
									duration={5}
									className="relative h-75 sm:h-100 lg:h-112.5 w-full"
								>
									<Image
										src="/Loona-hero-v2.png"
										alt="Loona the dachshund in all her glory"
										fill
										sizes="(max-width: 1024px) 100vw, 50vw"
										className="object-contain object-top"
										priority
									/>
								</FloatingElement>
							</FadeInUp>
						</div>

						{/* Tech Stack Card */}
						<FadeInUp delay={0.4}>
							<div className="card-glass-dim rounded-3xl border border-white/10 p-8 sm:p-10 transition-all duration-300 hover:-translate-y-2 hover:border-white/20 hover:shadow-xl">
								<h2 className="mb-4 font-serif text-2xl font-semibold text-white">
									The Tech Stack
								</h2>
								<div className="mb-6 flex flex-wrap gap-2">
									{[
										"Next.js",
										"React",
										"TypeScript",
										"Tailwind CSS",
										"Framer Motion",
										"Drizzle ORM",
										"Neon",
									].map((tech) => (
										<span
											key={tech}
											className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300 shadow-sm"
										>
											{tech}
										</span>
									))}
								</div>
								<p className="text-sm font-light leading-relaxed text-zinc-400">
									Loonary is built to be fast, smooth, and beautiful. It
									leverages modern web technologies to deliver a rich, app-like
									experience while remaining statically optimized and completely
									open for the world to read.
								</p>
							</div>
						</FadeInUp>
					</div>
				</div>

				{/* ── CTA ── */}
				<div className="mt-16 text-center">
					<FadeInUp delay={0.4}>
						<Link
							href="/blog"
							className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold tracking-wide text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
						>
							Read the stories ✦
						</Link>
					</FadeInUp>
				</div>
			</main>
		</div>
	);
}
