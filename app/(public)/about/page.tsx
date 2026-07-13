import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

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

			<main className="relative z-10 mx-auto w-full max-w-2xl flex-1 px-6 pb-20 pt-28">
				{/* ── DRAFT BANNER ── */}
				<div className="mb-10 rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-2.5 text-center text-xs text-amber-400/80">
					✏️ Draft page — content coming soon
				</div>

				{/* ── HERO ── */}
				<div className="mb-14 flex flex-col items-center text-center">
					{/* Loona portrait */}
					<div className="relative mb-6 h-44 w-44 overflow-hidden rounded-full border-2 border-white/10 shadow-[0_0_40px_rgba(176,189,214,0.15)]">
						<Image
							src="/Loona-hero-v2.png"
							alt="Loona the dachshund"
							fill
							sizes="176px"
							className="object-cover object-top scale-125"
							priority
						/>
					</div>

					<h1 className="mb-2 font-serif text-4xl font-semibold text-white">
						About Loonary
					</h1>
					<p className="font-serif text-light-blue">a moonlit digital diary</p>
				</div>

				{/* ── ABOUT THE BLOG ── */}
				<section className="mb-10">
					<div className="card-glass-dim rounded-2xl border border-white/10 px-7 py-8">
						<h2 className="mb-4 font-serif text-2xl font-semibold text-white">
							The Blog
						</h2>
						<p className="mb-4 text-sm font-light leading-relaxed text-zinc-400">
							{/* TODO: replace with real copy */}
							Loonary is a personal space for thoughts, stories, and reflections
							— written under the quiet glow of the moon. Inspired by a
							dachshund named Loona, it's equal parts diary, tech notes, and
							life musings.
						</p>
						<p className="text-sm font-light leading-relaxed text-zinc-400">
							{/* TODO: expand */}
							Built with Next.js, Neon Postgres, and Drizzle ORM as part of a
							full-stack capstone project — and designed to feel warm, calm, and
							a little bit magical.
						</p>
					</div>
				</section>

				{/* ── ABOUT THE AUTHOR ── */}
				<section className="mb-10">
					<div className="card-glass-dim rounded-2xl border border-white/10 px-7 py-8">
						<h2 className="mb-4 font-serif text-2xl font-semibold text-white">
							The Writer
						</h2>
						<p className="mb-4 text-sm font-light leading-relaxed text-zinc-400">
							{/* TODO: replace with real bio */}
							Hi, I'm Kenneth Claire — a developer who writes code by day and
							stories by night. I built this blog to practice shipping real
							full-stack projects and to have a cozy corner of the internet to
							call my own.
						</p>
						<p className="text-sm font-light leading-relaxed text-zinc-400">
							{/* TODO: add links */}
							When I'm not coding, I'm probably spending time with Loona,
							watching the moon, or overthinking a new side project.
						</p>
					</div>
				</section>

				{/* ── ABOUT LOONA ── */}
				<section className="mb-12">
					<div className="card-glass-dim rounded-2xl border border-white/10 px-7 py-8">
						<h2 className="mb-4 font-serif text-2xl font-semibold text-white">
							The Dog 🐾
						</h2>
						<p className="text-sm font-light leading-relaxed text-zinc-400">
							{/* TODO: add Loona's story */}
							Loona is a miniature dachshund and the true mascot of this blog.
							She doesn't write posts (yet), but she provides moral support,
							warmth, and the occasional dramatic sigh. The blog is named after
							her.
						</p>
					</div>
				</section>

				{/* ── CTA ── */}
				<div className="text-center">
					<Link
						href="/blog"
						className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/15"
					>
						Read the stories →
					</Link>
				</div>
			</main>
		</div>
	);
}
