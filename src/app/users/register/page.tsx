import { RegisterUser } from "@/components/users/register/RegisterUser";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
/**
 * ユーザー登録ページ
 * URL: /api/users/register
 */
// 💡キャッシュを無効化し、アクセスごとに必ずサーバー側で実行させる
export const dynamic = "force-dynamic";
export default async function RegisterUserPage() {
    // サーバー側でセッションを直接チェックする
    const session = await getServerSession(authOptions);
    // 未ログインなら、この時点でログイン画面へリダイレクト
    // クライアントコンポーネントが読み込まれる前に実行させる
    if (!session) {
        redirect("/login");
    }
    return (
        <main className="container mx-auto py-8">
            <RegisterUser />
        </main>
    );
}