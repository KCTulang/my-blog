import Image from "next/image";
import { Suspense } from "react";
import { PlaceholderCarousel } from "@/components/FeaturedBlogCarousel";
import PostsCarouselSection from "@/components/PostsCarouselSection";

export default function Home() {
	return (
		<div className="relative flex flex-1 flex-col overflow-hidden">
			<div
				aria-hidden="true"
				className="ambient-glow-home pointer-events-none absolute inset-0 z-0 hidden lg:block"
			/>

			{/* Cloud A */}
			<div
				aria-hidden="true"
				className="cloud-tr pointer-events-none absolute right-0 top-0 z-5 w-55 opacity-90 sm:w-75 lg:w-105"
			>
				<Image
					src="/Cloud.svg"
					alt=""
					width={420}
					height={210}
					className="h-auto w-full"
				/>
			</div>

			{/* Cloud B */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute z-5 opacity-85
					left-0 top-[38%] w-43.75 translate-x-[-32%]
					lg:bottom-0 lg:left-0 lg:top-auto lg:w-130 lg:translate-x-[-18%] lg:translate-y-[28%]"
			>
				<Image
					src="/Cloud.svg"
					alt=""
					width={520}
					height={260}
					className="h-auto w-full"
				/>
			</div>

			{/* Cloud C */}
			<div
				aria-hidden="true"
				className="cloud-br pointer-events-none absolute bottom-0 right-0 z-5 w-46.25 opacity-90 lg:w-67.5"
			>
				<Image
					src="/Cloud.svg"
					alt=""
					width={270}
					height={135}
					className="h-auto w-full"
				/>
			</div>

			{/* HERO */}
			<main
				id="hero"
				className="relative z-10 mx-auto flex w-full max-w-360 flex-1 flex-col items-center justify-center lg:flex-row lg:items-center"
			>
				{/* Stars + Moon */}
				<section
					aria-label="Moon"
					className="relative flex w-full shrink-0 items-center justify-center py-6 lg:w-[50%] lg:py-0 lg:pl-10"
				>
					{/* Stars */}
					<div
						className="pointer-events-none absolute left-3 top-2 z-20 w-22
							md:left-10 md:w-27
							lg:left-14 lg:top-10 lg:w-32"
					>
						<Image
							src="/Stars.svg"
							alt="Stars"
							width={147}
							height={163}
							className="h-auto w-full"
						/>
					</div>

					<Image
						src="/Moon.svg"
						alt="Moon"
						width={864}
						height={832}
						priority
						className="
						h-66.25 w-auto
						md:h-90
						lg:h-122.5
					"
					/>
				</section>

				{/* Logo + Subtitle + Carousel + Dog */}
				<section
					aria-label="Hero content"
					className="flex w-full flex-col items-center pb-8 lg:w-[50%] lg:items-start lg:pb-0 lg:pr-10"
				>
					{/* Loonary hero logo */}
					<div
						className="relative mb-0
							h-24 w-67
							sm:h-30 sm:w-85
							lg:h-38.75 lg:w-107.5"
					>
						<Image
							src="/Loonary.svg"
							alt="Loonary"
							fill
							priority
							sizes="(max-width: 640px) 268px, (max-width: 1024px) 340px, 430px"
							className="object-contain object-center lg:object-left"
						/>
					</div>

					{/* Subtitle */}
					<p
						className="mb-5 text-center font-serif tracking-wide text-light-blue
							text-[15px]
							lg:pl-5 lg:text-left lg:text-[17px]"
					>
						a moonlit digital diary
					</p>

					{/* ── Carousel + Loona Dog ── */}
					<div
						className="relative
							w-full max-w-85
							lg:max-w-102"
					>
						{/* Featured blog post carousel */}
						<Suspense fallback={<PlaceholderCarousel />}>
							<PostsCarouselSection />
						</Suspense>

						{/* Loona mascot */}
						<div
							className="pointer-events-none absolute z-20
								-right-13 -bottom-1.5 h-37 w-30
								lg:-right-16 lg:-bottom-2.5 lg:h-47.5 lg:w-38.5"
						>
							<Image
								src="/Loona-hero.png"
								alt="Loona the dachshund"
								fill
								sizes="(max-width: 1024px) 120px, 154px"
								className="object-contain object-bottom"
							/>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
