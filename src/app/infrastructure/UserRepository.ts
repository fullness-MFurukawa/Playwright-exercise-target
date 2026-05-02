import { injectable } from "inversify";
import { IUserRepository } from "../domain/repository/IUserRepository";
import { getSession } from "next-auth/react";
import { User } from "../domain/models/User";

/**
 * ユーザーリポジトリ実装クラス
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
        const response = await fetch(`/proxy-api/users/register/check?${params.toString()}`, {
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
                    // Object.valuesで配列を取り出し、flat()で1次配列に平坦化し、改行で結合する
                    const errorMessages = Object.values(errorData.errors).flat().join("\n");
                    throw new Error(errorMessages);
                } 
                // 単純なエラーメッセージの場合
                else if (errorData.message) {
                    throw new Error(errorData.message);
                } 
                // その他の場合
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
        // APIエンドポイントにPOSTリクエストを送信する
        const response = await fetch("/proxy-api/users/register", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`, // JWTトークンを付与する
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user) // UserオブジェクトをJSON文字列に変換して送信する
        });
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
                    // Object.valuesで配列を取り出し、flat()で1次配列に平坦化し、改行で結合する
                    const errorMessages = Object.values(errorData.errors).flat().join("\n");
                    throw new Error(errorMessages);
                } 
                // 単純なエラーメッセージの場合
                else if (errorData.message) {
                    throw new Error(errorData.message);
                } 
                // その他の場合
                else {
                    throw new Error("入力内容にエラーがあります。");
                }
            default:
                // その他のエラー (500など)
                throw new Error("ユーザー登録処理に失敗しました。");
        }
    }
}
