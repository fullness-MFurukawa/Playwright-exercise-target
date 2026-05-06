import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProductUpdateContainer } from "@/components/products/update/ProductUpdateContainer";
/**
 * /products/updateのルーティングページ
 */
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
                <ProductUpdateContainer />
            </main>);
}