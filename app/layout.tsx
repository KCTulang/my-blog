import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

const lora = Lora({
	subsets: ["latin"],
	variable: "--font-lora",
});

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

export const metadata: Metadata = {
	title: "Loonary: A moonlit digital diary.",
	description: "Thoughts and stories under the moonlight.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				id="app-root"
				className={`${inter.variable} ${lora.variable} antialiased flex min-h-screen flex-col`}
			>
				<CustomCursor />
				{children}
			</body>
		</html>
	);
}
