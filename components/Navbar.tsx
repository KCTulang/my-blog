"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
	{ name: "All Stories", path: "/" },
	{ name: "About Loonary", path: "/about" },
	{ name: "Contact", path: "/contact" },
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

	const navClasses = `flex w-full flex-col items-center justify-between bg-white/80 backdrop-blur-md text-zinc-900 md:flex-row dark:bg-black/80 dark:text-zinc-100 ${TRANSITION} ${
		isScrolled
			? "rounded-2xl px-6 py-2 shadow-lg border border-zinc-200 dark:border-zinc-800"
			: "px-8 py-4 border-b border-zinc-100 dark:border-zinc-900"
	}`;

	const getLinkClasses = (isActive: boolean) => {
		const baseClasses =
			"block rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300";
		// Using a soft "lunar" blue/indigo accent instead of crimson
		const activeClasses =
			"bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300";
		const inactiveClasses =
			"text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100";

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
						className="text-lg font-serif font-bold tracking-tight"
					>
						Loonary
					</Link>

					<button
						type="button"
						className="p-2 md:hidden"
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
