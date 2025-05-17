import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.ebook-hunter.org',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
