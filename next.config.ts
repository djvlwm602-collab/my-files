import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/my-files',
  images: {
    unoptimized: true,
  },
  env: {
    // basePath를 이미지 경로에 수동으로 접두사 적용하기 위해 노출
    NEXT_PUBLIC_BASE_PATH: '/my-files',
  },
};

export default nextConfig;
