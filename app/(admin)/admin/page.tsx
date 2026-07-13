import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";
import { verifySession } from "@/lib/session";

export const metadata: Metadata = {
	title: "Login · Loonary Admin",
	robots: { index: false, follow: false },
};

async function AuthCheck() {
	const session = await verifySession();
	if (session) redirect("/admin/posts");
	return null;
}

export default function AdminLoginPage() {
	return (
		<div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden">
			{/* Ambient background matching homepage */}
			<div
				aria-hidden="true"
				className="ambient-glow-home pointer-events-none absolute inset-0 z-0"
			/>

			<Suspense fallback={null}>
				<AuthCheck />
			</Suspense>

			<main className="relative z-10 w-full max-w-sm px-4">
				<div className="card-glass-dim flex flex-col items-center rounded-3xl border border-white/10 px-8 py-12">
					<div className="mb-8 w-32">
						<Image
							src="/Loonary.svg"
							alt="Loonary"
							width={256}
							height={128}
							priority
							className="h-auto w-full object-contain"
						/>
					</div>

					<div className="w-full">
						<LoginForm />
					</div>
				</div>
			</main>
		</div>
	);
}
