import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	cacheComponents: true,
	experimental: {
		serverActions: {
			allowedOrigins: [
				"localhost:3000",
				"*.vercel.app",
				"my-blog-*.vercel.app",
			],
		},
	},
};

export default nextConfig;
