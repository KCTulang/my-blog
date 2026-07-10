"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
	{ name: "Stories", path: "/" },
	{ name: "About", path: "/about" },
];

const TRANSITION =
	"transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]";

export default function Navbar() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		const handleScroll = () => setIsScrolled(window.scrollY > 50);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const closeMenu = () => setIsMenuOpen(false);

	const headerClasses = `fixed left-0 right-0 z-50 mx-auto flex justify-center will-change-transform ${TRANSITION} ${
		isScrolled ? "top-4 w-[calc(100%-2rem)] max-w-3xl" : "top-0 w-full"
	}`;

	const navClasses = `flex w-full flex-col items-center justify-between backdrop-blur-md text-[--color-off-white] md:flex-row ${TRANSITION} ${
		isScrolled
			? "rounded-2xl px-6 py-2 shadow-lg bg-white/2 border border-white/5 bg-transparent"
			: "px-8 py-4 shadow-[0_1px_0_0_rgba(255,255,255,0.02),0_0_5px_0_rgba(255,255,255,0.20)] bg-transparent"
	}`;

	const getLinkClasses = (isActive: boolean) => {
		const baseClasses =
			"block rounded-full px-4 py-2 text-xs font-bold font-serif tracking-tight transition-all duration-300";
		const activeClasses =
			"bg-white/6 text-[--color-off-white] border border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.70)]";
		const inactiveClasses =
			"text-zinc-400 hover:bg-white/8 hover:text-[--color-off-white]";

		return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
	};

	return (
		<header className={headerClasses}>
			<nav className={navClasses}>
				<div className="flex w-full items-center justify-between md:w-auto">
					<Link
						href="/"
						onClick={() => {
							closeMenu();
							window.scrollTo({ top: 0, behavior: "smooth" });
						}}
						className="flex items-center gap-2 hover:opacity-80 transition-opacity"
					>
						<Image
							src="/loonary.svg?v=2"
							alt="Loonary Logo"
							width={70}
							height={70}
							priority
						/>
					</Link>

					<button
						type="button"
						className="p-2 md:hidden text-zinc-400"
						onClick={() => setIsMenuOpen((prev) => !prev)}
					>
						{isMenuOpen ? "✕" : "☰"}
					</button>
				</div>

				<div
					className={`z-50 w-full flex-col items-center gap-1 mt-4 md:mt-0 md:flex md:w-auto md:flex-row ${isMenuOpen ? "flex" : "hidden"}`}
				>
					{NAV_LINKS.map(({ name, path }) => (
						<div key={name} className="w-full text-center md:w-auto">
							<Link
								href={path}
								onClick={closeMenu}
								className={getLinkClasses(pathname === path)}
							>
								{name}
							</Link>
						</div>
					))}
				</div>
			</nav>
		</header>
	);
}
