import { RegisterUser } from "@/components/users/register/RegisterUser";
/**
 * ユーザー登録ページ
 * URL: /api/users/register
 */
export default function RegisterUserPage() {
    return (
        <main className="container mx-auto py-8">
            <RegisterUser />
        </main>
    );
}