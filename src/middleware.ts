import withAuth from "next-auth/middleware";

/**
 * 商品管理系のすべてのページをガード対象とする
 * ユーザー登録画面も認証必須とするためガード対象とする
 */
export default withAuth({
  pages: {
    // カスタムのログイン画面（例: app/login/page.tsx）のパスを指定
    // basePathがあるので、実際のブラウザ上のURLは http://IP/front/login
    signIn: "/login", 
  },
});

export const config = {
  // matcherには basePath (/front)を含めず、相対パスで
  matcher: [
    "/products/:path*",
    "/users/:path*"
  ],
};