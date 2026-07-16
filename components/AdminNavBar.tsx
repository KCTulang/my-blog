"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logoutAction } from "@/lib/actions";

const NAV_LINKS = [
	{ href: "/admin/posts", label: "Posts" },
	{ href: "/admin/comments", label: "Comments" },
];

export default function AdminNavBar() {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	// Close on route change
	useEffect(() => {
		setIsOpen(false);
	}, []);

	// Close on outside click
	useEffect(() => {
		if (!isOpen) return;
		function handleClick(e: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, [isOpen]);

	// Prevent scroll while menu open
	useEffect(() => {
		document.body.style.overflow = isOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	// Don't render nav on the login page
	if (pathname === "/admin") return null;

	return (
		<header
			ref={menuRef}
			className="fixed left-0 right-0 top-0 z-50 w-full border-b border-white/5 bg-black/30 backdrop-blur-md shadow-[0_1px_0_0_rgba(255,255,255,0.04)]"
		>
			<nav className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
				{/* Logo */}
				<Link
					href="/admin/posts"
					className="flex items-center opacity-80 hover:opacity-100 transition-opacity"
					aria-label="Admin dashboard"
				>
					<Image
						src="/Loonary.svg"
						alt="Loonary"
						width={72}
						height={26}
						className="h-6 w-auto object-contain"
					/>
					<span className="ml-2 text-[11px] font-mono tracking-widest text-zinc-500">
						ADMIN
					</span>
				</Link>

				{/* Desktop nav */}
				<div className="hidden sm:flex items-center gap-1">
					{NAV_LINKS.map(({ href, label }) => {
						const isActive = pathname.startsWith(href);
						return (
							<Link
								key={href}
								href={href}
								className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-150 ${
									isActive
										? "bg-white/8 text-white border border-white/10"
										: "text-zinc-400 hover:text-zinc-200 hover:bg-white/4"
								}`}
							>
								{label}
							</Link>
						);
					})}

					{/* Divider */}
					<span className="mx-2 h-4 w-px bg-white/10" aria-hidden="true" />

					{/* Logout */}
					<form action={logoutAction}>
						<button
							type="submit"
							className="min-h-9 rounded-full px-4 py-2 text-[13px] font-medium text-red-400/70 transition-all duration-150 hover:bg-red-500/10 hover:text-red-300"
						>
							Log out
						</button>
					</form>
				</div>

				{/* Mobile hamburger */}
				<button
					type="button"
					aria-label={isOpen ? "Close menu" : "Open menu"}
					aria-expanded={isOpen}
					aria-controls="admin-mobile-menu"
					className="flex sm:hidden min-h-11 min-w-11 items-center justify-center text-zinc-400 hover:text-white transition-colors"
					onClick={() => setIsOpen((prev) => !prev)}
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						aria-hidden="true"
					>
						{isOpen ? (
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
				id="admin-mobile-menu"
				aria-hidden={!isOpen}
				className={`sm:hidden overflow-hidden transition-all duration-200 ease-out border-t border-white/5 bg-black/20 backdrop-blur-sm
					${isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}
			>
				<div className="flex flex-col px-4 py-3 gap-1">
					{NAV_LINKS.map(({ href, label }) => {
						const isActive = pathname.startsWith(href);
						return (
							<Link
								key={href}
								href={href}
								onClick={() => setIsOpen(false)}
								className={`rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150 ${
									isActive
										? "bg-white/8 text-white border border-white/10"
										: "text-zinc-400 hover:text-zinc-200 hover:bg-white/4"
								}`}
							>
								{label}
							</Link>
						);
					})}

					<div className="mt-1 border-t border-white/5 pt-2">
						<form action={logoutAction}>
							<button
								type="submit"
								className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-400/70 transition-all duration-150 hover:bg-red-500/10 hover:text-red-300"
							>
								Log out
							</button>
						</form>
					</div>
				</div>
			</div>
		</header>
	);
}
