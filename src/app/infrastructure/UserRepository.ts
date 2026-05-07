import { injectable } from "inversify";
import { IUserRepository } from "../domain/repository/IUserRepository";
import { getSession } from "next-auth/react";
import { User } from "../domain/models/User";

/**
 * IUserRepositoryインターフェイス実装
 */
@injectable() // DIコンテナの管理対象とするためのデコレータ
export class UserRepository implements IUserRepository {
   
    /**
     * 指定したユーザー名またはメールアドレスが既に存在するかチェックする
     * @param username ユーザー名
     * @param email メールアドレス
     * @exception 重複チェック処理に失敗した場合は例外をスローする 
     */
    async checkExists(username: string, email: string): Promise<void> {
        // NextAuthから現在のセッション(ログイン情報)を取得する
        const session = await getSession();
        const token = (session as any)?.user?.token;
        // クエリストパラメータを作成する
        const params = new URLSearchParams({ username, email });
        // APIエンドポイントにGETリクエストを送信する
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
        const response = await fetch(`${apiBaseUrl}/users/register/check?${params.toString()}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // JWTトークンを付与する
                "Content-Type": "application/json"
            }
        });
        // ステータスコードに応じたハンドリング
        switch (response.status) {
            case 200:
                // 200(OK)の場合は重複なしのため、何も返さず正常終了(void)とする
                return;
            case 400:
            case 409:
                // 400(Bad Request)または 409(Conflict) の場合は、バックエンドのエラーメッセージを取得してスローする
                const errorData = await response.json();
                // バリデーションエラー(errorsプロパティが存在する)の場合
                if (errorData.errors) {
                    const validationError = new Error("バリデーションエラーが発生しました。");
                    (validationError as any).serverErrors = errorData.errors; // 項目別エラーを格納
                    throw validationError;
                } 
                else if (errorData.message) {
                    throw new Error(errorData.message);
                } 
                else {
                    throw new Error("入力内容にエラーがあります。");
                }
            default:
                // その他のエラー (500など)
                throw new Error("重複チェック処理に失敗しました。");
        }
    }
    /**
     * ユーザーを登録する
     * @param user 登録ユーザー
     * @exception ユーザー登録処理に失敗や重複があった場合は例外をスローする
     */
    async register(user: User): Promise<void> {
        // NextAuthから現在のセッション(ログイン情報)を取得する
        const session = await getSession();
        const token = (session as any)?.user?.token;


        // ✅ 追加：ログインしていない（トークンがない）場合は即座にエラーにする
        if (!session || !token) {
            throw new Error("権限エラー：ユーザー登録を行うにはログインが必要です。");
        }

        // APIエンドポイントにPOSTリクエストを送信する
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
        const response = await fetch(`${apiBaseUrl}/users/register`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`, // JWTトークンを付与する
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user) // UserオブジェクトをJSON文字列に変換して送信する
        });
        // fetch の直後に追加
        console.log(`★ステータス: ${response.status}`);
        console.log("★レスポンスの中身:", await response.clone().text());
        switch (response.status) {
            case 200:
            case 201:
                return; // 201(Created)の場合は正常終了
            case 400:
            case 409:
                // 400(Bad Request)または 409(Conflict) の場合は、バックエンドのエラーメッセージを取得してスローする
                const errorData = await response.json();
                // バリデーションエラー(errorsプロパティが存在する)の場合
                if (errorData.errors) {
                    const validationError = new Error("バリデーションエラーが発生しました。");
                    (validationError as any).serverErrors = errorData.errors; // 項目別エラーを格納
                    throw validationError;
                } 
                else if (errorData.message) {
                    throw new Error(errorData.message);
                } 
                else {
                    throw new Error("入力内容にエラーがあります。");
                }
            default:
                // その他のエラー (500など)
                throw new Error("ユーザー登録処理に失敗しました。");
        }
    }
}
