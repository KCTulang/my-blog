"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions";

export default function AdminNav() {
	const pathname = usePathname();

	const links = [
		{ href: "/admin/posts", label: "Posts" },
		{ href: "/admin/comments", label: "Comments" },
	];

	return (
		<nav className="mb-8 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-sm backdrop-blur-md sm:px-6">
			<div className="flex gap-4 sm:gap-6">
				{links.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className={`text-sm font-medium transition-colors ${
							pathname.startsWith(link.href)
								? "text-white"
								: "text-zinc-400 hover:text-zinc-200"
						}`}
					>
						{link.label}
					</Link>
				))}
			</div>

			<form action={logoutAction}>
				<button
					type="submit"
					className="min-h-11 px-2 text-sm font-medium text-red-400/80 transition-colors hover:text-red-300"
				>
					Log out
				</button>
			</form>
		</nav>
	);
}
