import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // ミドルウェアがそのURLを検知したかを出力
    console.log("🔥 [Middleware実行] アクセス先パス:", req.nextUrl.pathname);
  },
  {
    callbacks: {
      // ここで「アクセスを許可するか（true/false）」を明示的に判定します
      authorized: ({ req, token }) => {
        console.log("🔥 [Middleware判定] トークン(Cookie)の状態:", token ? "存在します（ログイン扱い）" : "空っぽです（未ログイン）");
        
        // トークンがあれば true (アクセス許可)、なければ false (ログイン画面へ強制送還)
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/products/:path*",
    "/users/:path*"
  ],
};
