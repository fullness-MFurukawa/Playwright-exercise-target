import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: '/front', // フロントエンドのパス
  async redirects() {
    return [
      {
        source: '/',
        // 転送先：http://localhost:3000/front
        destination: '/front',
        // 【重要】これを false にしないと、/front/がsourceになってしまう
        basePath: false, 
        // ブラウザにキャッシュさせる永続的なリダイレクト（308）
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
