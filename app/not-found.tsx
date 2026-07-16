import Image from "next/image";
import Link from "next/link";
import FadeInUp from "@/components/FadeInUp";
import FloatingElement from "@/components/FloatingElement";

export default function NotFound() {
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
			/
			<main className="relative z-10 w-full max-w-2xl text-center">
				<FadeInUp>
					<div className="flex flex-col items-center card-glass-dim rounded-3xl border border-white/10 p-10 sm:p-14 shadow-xl">
						<FloatingElement
							yOffset={10}
							duration={4}
							className="relative h-48 w-48 sm:h-64 sm:w-64 mb-8"
						>
							<Image
								src="/Ream.png"
								alt="Ream the dog looking confused"
								fill
								sizes="(max-width: 640px) 192px, 256px"
								className="object-contain"
								priority
							/>
						</FloatingElement>

						<h1 className="mb-4 font-serif text-4xl sm:text-5xl font-semibold text-white">
							404 - Wrong Dog!
						</h1>

						<p className="mb-10 text-base sm:text-lg font-light leading-relaxed text-zinc-300 max-w-md mx-auto">
							It seems you've wandered into the wrong yard. That's Ream, not
							Loona! Let's get you back to the right moonlit path.
						</p>

						<Link
							href="/"
							className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold tracking-wide text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
						>
							Return to Home ✦
						</Link>
					</div>
				</FadeInUp>
			</main>
		</div>
	);
}
