import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // ログを残して、サーバー側で動作を確認できるようにする
    console.log("🔥 [Middleware実行] アクセス先パス:", req.nextUrl.pathname);
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // トークンが「本当にあるか」を厳しくチェック
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

// 💡 ここを修正：特定のフォルダではなく、
// 「静的ファイル」「API」「ログイン画面」**以外すべて**を監視対象にします。
export const config = {
  matcher: [
    /*
     * 以下のパス以外、すべてにミドルウェアを適用する
     * - api (APIルート)
     * - _next/static (静的ファイル)
     * - _next/image (画像最適化)
     * - favicon.ico (アイコン)
     * - login (ログインページ自体は除外しないと無限ループになる)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
  ],
};