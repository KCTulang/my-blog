"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
	{ name: "Stories", path: "/blog" },
	{ name: "About", path: "/about" },
];

export default function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const pathname = usePathname();
	const menuRef = useRef<HTMLDivElement>(null);

	const closeMenu = () => setIsMenuOpen(false);

	// Close drawer when route changes
	useEffect(() => {
		if (pathname) {
			setIsMenuOpen(false);
		}
	}, [pathname]);

	// Close drawer on outside click
	useEffect(() => {
		if (!isMenuOpen) return;
		function handleClick(e: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setIsMenuOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, [isMenuOpen]);

	// Prevent body scroll while menu open
	useEffect(() => {
		document.body.style.overflow = isMenuOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isMenuOpen]);

	const getLinkClasses = (isActive: boolean) => {
		const base =
			"block text-center rounded-full px-5 py-3 text-[13px] font-serif font-bold tracking-tight transition-all duration-200";
		const active =
			"bg-white/[0.06] text-gold border border-white/[0.08] shadow-[0_4px_20px_0_rgba(0,0,0,0.50)]";
		const inactive = "text-zinc-400 hover:text-off-white";
		return `${base} ${isActive ? active : inactive}`;
	};

	return (
		<header
			ref={menuRef}
			className="shadow-navbar fixed left-0 right-0 top-0 z-50 w-full"
		>
			<nav className="flex w-full items-center justify-between px-5 py-3 backdrop-blur-sm md:px-8 md:py-4">
				{/* Logo */}
				<Link
					href="/"
					onClick={() => {
						closeMenu();
						window.scrollTo({ top: 0, behavior: "smooth" });
					}}
					className="flex items-center hover:opacity-80 transition-opacity"
					aria-label="Loonary home"
				>
					<Image
						src="/Loonary.svg"
						alt="Loonary"
						width={78}
						height={28}
						className="h-7 w-auto object-contain"
						priority
					/>
				</Link>

				{/* Desktop nav links */}
				<div className="hidden md:flex items-center gap-1">
					{NAV_LINKS.map(({ name, path }) => (
						<Link
							key={name}
							href={path}
							className={getLinkClasses(pathname === path)}
						>
							{name}
						</Link>
					))}
				</div>

				{/* Mobile hamburger */}
				<button
					type="button"
					aria-label={isMenuOpen ? "Close menu" : "Open menu"}
					aria-expanded={isMenuOpen}
					aria-controls="mobile-menu"
					className="flex md:hidden min-h-11 min-w-11 items-center justify-center text-zinc-400 hover:text-white transition-colors"
					onClick={() => setIsMenuOpen((prev) => !prev)}
				>
					<svg
						width="22"
						height="22"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						aria-hidden="true"
					>
						{isMenuOpen ? (
							<>
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</>
						) : (
							<>
								<line x1="3" y1="6" x2="21" y2="6" />
								<line x1="3" y1="12" x2="21" y2="12" />
								<line x1="3" y1="18" x2="21" y2="18" />
							</>
						)}
					</svg>
				</button>
			</nav>

			{/* Mobile dropdown */}
			<div
				id="mobile-menu"
				className={`md:hidden overflow-hidden transition-all duration-200 ease-out backdrop-blur-sm
					${isMenuOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
				aria-hidden={!isMenuOpen}
			>
				<div className="flex flex-col items-stretch gap-1 px-5 pb-4 pt-1">
					{NAV_LINKS.map(({ name, path }) => (
						<Link
							key={name}
							href={path}
							onClick={closeMenu}
							className={getLinkClasses(pathname === path)}
						>
							{name}
						</Link>
					))}
				</div>
			</div>
		</header>
	);
}
