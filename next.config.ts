import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/my-files',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
