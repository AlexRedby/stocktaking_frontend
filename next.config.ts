import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Proxy to Backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/:path*', 
      },
    ];
  },
};

export default nextConfig;
