import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ensure this is NOT set to 'export'
  // output: 'standalone', // Optional: Only if you need standalone output
};
export default nextConfig;
