import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint during builds
  },
  images: {
    domains: ['cdn.metacms.us'], // Add the domain to this array
  },
};


export default nextConfig;
