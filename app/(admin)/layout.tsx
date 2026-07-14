import { Suspense } from "react";
import { Toaster } from "sonner";
import AdminNavBar from "@/components/AdminNavBar";
import DecorativeClouds from "@/components/DecorativeClouds";

export default function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<DecorativeClouds animated={false} />
			<Suspense fallback={null}>
				<AdminNavBar />
			</Suspense>
			{children}
			<Toaster theme="dark" position="bottom-center" />
		</>
	);
}
