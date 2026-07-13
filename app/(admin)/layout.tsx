import { Suspense } from "react";
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
		</>
	);
}
