import { Suspense } from "react";
import DecorativeClouds from "@/components/DecorativeClouds";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

function NavbarShell() {
	return (
		<header className="shadow-navbar fixed left-0 right-0 top-0 z-50 w-full">
			<nav className="flex w-full items-center justify-between px-6 py-3 backdrop-blur-sm md:px-8 md:py-4">
				<div className="h-7 w-20 rounded bg-white/5" />
				<div className="hidden items-center gap-4 md:flex">
					<div className="h-6 w-16 rounded-full bg-white/5" />
					<div className="h-6 w-12 rounded-full bg-white/5" />
				</div>
			</nav>
		</header>
	);
}

export default function PublicLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Suspense fallback={<NavbarShell />}>
				<Navbar />
			</Suspense>
			<DecorativeClouds />
			{children}
			<Footer />
		</>
	);
}
