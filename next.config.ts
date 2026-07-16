import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	cacheComponents: true,
	experimental: {
		serverActions: {
			allowedOrigins: [
				"localhost:3000",
				"*.vercel.app",
			],
		},
	},
};

export default nextConfig;
