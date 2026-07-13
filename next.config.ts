import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Partial Prerendering (PPR) — in Next.js 16, experimental.ppr was
	// merged into cacheComponents. This is the equivalent of experimental.ppr: true.
	cacheComponents: true,
};

export default nextConfig;
