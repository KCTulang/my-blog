import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	cacheComponents: true,
	experimental: {
		serverActions: {},
	},
};

export default nextConfig;
