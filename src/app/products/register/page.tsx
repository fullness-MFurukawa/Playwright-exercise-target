import { ProductRegister } from "@/components/products/register/ProductRegister";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
/**
 * /products/registerのルーティングページ
 */
// 💡キャッシュを無効化し、アクセスごとに必ずサーバー側で実行させる
export const dynamic = "force-dynamic";
export default async function Page() {
    // サーバー側でセッションを直接チェックする
    const session = await getServerSession(authOptions);
      // 未ログインなら、この時点でログイン画面へリダイレクト
      // クライアントコンポーネントが読み込まれる前に実行させる
    if (!session) {
        redirect("/login");
    }
    return (<main className="container mx-auto py-8">
                <ProductRegister />
            </main>);
}