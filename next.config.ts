import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: '/front', // フロントエンドのパス
  
  async redirects() {
    return [
      {
        source: '/',
        destination: '/front',
        basePath: false, 
        permanent: true,
      },
    ];
  },
  
  async rewrites() {
    return [
      {
        // フロントエンドから /proxy-api/ で始まる通信が来たら...
        source: '/proxy-api/:path*',
        // 裏側でこっそりAzureのAPIへ転送する！
        destination: 'http://74.226.194.15/api/:path*',
        // 💡 追加：basePath（/front）を自動付与しないようにする
        basePath: false,
      },
    ];
  },
};

export default nextConfig;