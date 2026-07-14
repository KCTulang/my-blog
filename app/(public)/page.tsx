import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import FadeInUp from "@/components/FadeInUp";
import { PlaceholderCarousel } from "@/components/FeaturedBlogCarousel";
import FloatingElement from "@/components/FloatingElement";
import HiddenAdminLink from "@/components/HiddenAdminLink";
import PeekabooEntrance from "@/components/PeekabooEntrance";
import PostsCarouselSection from "@/components/PostsCarouselSection";

export default function Home() {
	return (
		<div className="relative flex flex-1 flex-col overflow-hidden">
			{/* Ambient glow — visible on all sizes */}
			<div
				aria-hidden="true"
				className="ambient-glow-home pointer-events-none absolute inset-0 z-0 hidden lg:block"
			/>

			{/* HERO */}
			<main
				id="hero"
				className="relative z-10 mx-auto flex w-full max-w-360 flex-1 flex-col items-center
					pt-16 pb-6 px-4
					sm:pt-20 sm:pb-8 sm:px-6
					lg:flex-row lg:items-center lg:px-8 lg:py-0 lg:pt-0"
			>
				{/* Stars + Moon */}
				<section
					aria-label="Moon"
					className="relative flex flex-1 w-full items-center justify-center
						py-2
						sm:py-4
						lg:flex-none lg:w-[48%] lg:py-0"
				>
					{/* Stars  */}
					<FloatingElement
						duration={4}
						delay={1}
						yOffset={15}
						xOffset={5}
						className="pointer-events-none absolute z-20 w-16 opacity-90
							left-[18%] top-[18%]
							sm:left-[20%] sm:top-[20%] sm:w-20
							md:w-24
							lg:left-[10%] lg:top-[18%] lg:w-36 lg:opacity-100"
					>
						<Image
							src="/Stars.svg"
							alt="Stars"
							width={147}
							height={163}
							className="h-auto w-full"
						/>
					</FloatingElement>

					<FloatingElement duration={4} delay={0.5} yOffset={25}>
						<Image
							src="/Moon.svg"
							alt="Moon"
							width={864}
							height={832}
							priority
							className="h-120 w-auto sm:h-136 md:h-152 lg:h-[90vh] pointer-events-none"
						/>
					</FloatingElement>
				</section>

				{/* Logo + Subtitle + Carousel + Dog */}
				<section
					aria-label="Hero content"
					className="flex w-full flex-col items-center
						-mt-16 pb-20
						sm:-mt-20 sm:pb-16
						lg:w-[52%] lg:items-start lg:pb-0 lg:pr-8 lg:mt-0"
				>
					{/* Loonary hero logo */}
					<HiddenAdminLink>
						<div
							className="relative mb-0
								h-24 w-72
								sm:h-28 sm:w-84
								md:h-32 md:w-96
								lg:h-52 lg:w-135"
						>
							<Image
								src="/Loonary.svg"
								alt="Loonary"
								fill
								priority
								sizes="(max-width: 640px) 288px, (max-width: 768px) 336px, (max-width: 1024px) 384px, 540px"
								className="object-contain object-center lg:object-left"
							/>
						</div>
					</HiddenAdminLink>

					{/* Subtitle */}
					<p
						className="mt-1 mb-6 font-serif tracking-wide text-off-white text-center
							text-[14px]
							sm:text-[14px]
							lg:mt-0 lg:mb-5 lg:text-[17px] lg:text-left lg:pl-[22%]"
					>
						a moonlit digital diary
					</p>

					{/* Carousel + Loona Dog */}
					<div
						className="relative
							w-full max-w-75
							sm:max-w-85
							lg:max-w-102"
					>
						{/* Featured blog post carousel */}
						<Suspense fallback={<PlaceholderCarousel />}>
							<PostsCarouselSection />
						</Suspense>

						{/* Loona mascot — click to visit About page */}
						<PeekabooEntrance
							delay={0.6}
							className="absolute z-20 -right-20 bottom-0 sm:-right-22 sm:-bottom-2 lg:-right-36 lg:-bottom-5"
						>
							<Link
								href="/about"
								aria-label="Meet Loona — visit the About page"
								className="group block h-36 w-28
									sm:h-44 sm:w-36
									lg:h-64 lg:w-52
									cursor-pointer transition-transform duration-300 ease-out
									hover:scale-105 hover:-translate-y-1"
							>
								{/* Tooltip */}
								<span
									aria-hidden="true"
									className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2
										whitespace-nowrap rounded-full border border-white/15
										bg-[#0d1526]/80 px-3 py-1 text-xs font-semibold text-white/80
										opacity-0 backdrop-blur-sm transition-opacity duration-200
										group-hover:opacity-100"
								>
									About Loonary ✦
								</span>

								<Image
									src="/Loona-hero-v2.png"
									alt="Loona the dachshund — click to learn more"
									fill
									sizes="(max-width: 640px) 112px, (max-width: 1024px) 144px, 208px"
									className="object-contain object-bottom"
								/>
							</Link>
						</PeekabooEntrance>
					</div>
				</section>
			</main>

			{/* About Section */}
			<section className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-32 sm:px-6 lg:py-48 text-center">
				<FadeInUp>
					<h2 className="mb-12 font-serif text-3xl font-semibold text-white sm:text-4xl">
						Behind the Diary
					</h2>
				</FadeInUp>

				<div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{[
						{
							title: "The Author",
							desc: "A developer and dreamer sharing late-night thoughts, code adventures, and reflections under the moonlight.",
						},
						{
							title: "The Concept",
							desc: "Why call a public blog a diary? Because it's written with the vulnerability and raw honesty of a private journal, just left open under the moonlight for fellow wanderers to find.",
						},
						{
							title: "The Companion",
							desc: "Meet Loona, the ever-curious dachshund mascot who occasionally wanders through the pages of this journal.",
						},
					].map((item, i) => (
						<FadeInUp
							key={item.title}
							delay={0.15 + i * 0.1}
							className="flex h-full w-full"
						>
							<div className="card-glass-dim flex flex-1 flex-col items-center text-center rounded-3xl border border-white/10 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-white/20 hover:shadow-xl">
								<h3 className="mb-3 font-serif text-xl font-semibold text-white">
									{item.title}
								</h3>
								<p className="text-sm font-light leading-relaxed text-zinc-400 mb-6 flex-1">
									{item.desc}
								</p>
								<Link
									href="/about"
									className="mt-auto inline-flex items-center text-xs font-semibold text-white/50 transition-colors duration-200 hover:text-white"
								>
									Learn more <span className="ml-1">→</span>
								</Link>
							</div>
						</FadeInUp>
					))}
				</div>
			</section>

			{/* Explore Section */}
			<section className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-4 pb-32 pt-16 sm:px-6 lg:pb-48 text-center">
				<FadeInUp delay={0.2}>
					<h2 className="mb-8 font-serif text-2xl font-semibold text-white sm:text-3xl">
						Ready to Explore?
					</h2>
					<Link
						href="/blog"
						className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold tracking-wide text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
					>
						Read the Stories ✦
					</Link>
				</FadeInUp>
			</section>
		</div>
	);
}
