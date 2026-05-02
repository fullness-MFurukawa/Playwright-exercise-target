import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";
/**
 * NextAuthのAPIルートハンドラー
 */
const handler = NextAuth(authOptions);
// Next.jsの仕様に基づき、GETとPOSTメソッドを公開
export { handler as GET, handler as POST };
