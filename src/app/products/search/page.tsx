import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProductSearch } from "@/components/products/search/ProductSearch";
import { redirect } from "next/navigation";
/**
 * 商品キーワード検索ページ
 * URL: /products/search
 */
// 💡キャッシュを無効化し、アクセスごとに必ずサーバー側で実行させる
export const dynamic = "force-dynamic";
export default async function ProductSearchPage() {
  // サーバー側でセッションを直接チェックする
  const session = await getServerSession(authOptions);
  // 未ログインなら、この時点でログイン画面へリダイレクト
  // クライアントコンポーネントが読み込まれる前に実行させる
  if (!session) {
    redirect("/login");
  }
  return (
    <main className="container mx-auto py-8">
      <ProductSearch />
    </main>
  );
}