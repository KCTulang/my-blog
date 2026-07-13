export default function Footer() {
	return (
		<footer className="relative z-10 w-full mt-auto bg-transparent border-t border-white/5 shadow-[0_-1px_0_0_rgba(255,255,255,0.02),0_0_5px_0_rgba(255,255,255,0.20)]">
			<div className="mx-auto w-full max-w-3xl px-8 py-8 sm:px-16">
				<div className="flex flex-col md:flex-row justify-between items-center gap-6">
					<div className="w-full text-center md:text-left md:text-auto">
						<p className="text-xs font-serif tracking-tight text-zinc-400">
							© 2026 Kenneth Claire Tulang. All rights reserved.
						</p>
					</div>

					<div className="flex w-full items-center justify-center md:justify-end gap-4 text-xs font-serif tracking-tight text-zinc-400">
						<p>
							Built with{" "}
							<span className="font-bold text-[--color-off-white]">
								Next.js
							</span>{" "}
							&{" "}
							<span className="font-bold text-[--color-off-white]">
								Tailwind CSS
							</span>
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
