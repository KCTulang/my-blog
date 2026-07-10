import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

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
			<body className={`${inter.variable} ${lora.variable} antialiased`}>
				<Navbar />
				{children}
				<Footer />
			</body>
		</html>
	);
}
