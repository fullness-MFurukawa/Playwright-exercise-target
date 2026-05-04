import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        usernameOrEmail: { label: "UsernameorEmail", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const res = await fetch("http://74.226.194.15/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
              usernameOrEmail: credentials?.usernameOrEmail, 
              password: credentials?.password,
            }),
            headers: { "Content-Type": "application/json" },
          });

          const token = await res.json();
          if (res.ok && token) {
            return token;
          }
          return null;
        } catch (error) {
          console.error("★★★ バックエンドAPIとの通信エラー詳細 ★★★", error);
          return null;
        }
      }
    }),
  ],
  // 💡 [追加] セッションの戦略を明示し、maxAgeを指定しない
  session: {
    strategy: "jwt",
  },
  // 💡 [追加] クッキーの設定を強制的に上書き
  // これを行わないと、/front 以外のパスでクッキーが認識されない場合があります
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',        // どこからでもクッキーを参照可能にする
        secure: false,     // HTTP（非SSL）でもクッキーを送信可能にする
      },
    },
  },

  pages: {
    signIn: '/login', 
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user = token as any;
      }
      return session;
    },
  },
};