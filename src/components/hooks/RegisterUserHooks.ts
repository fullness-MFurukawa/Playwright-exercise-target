import { container } from "@/app/di/container";
import { TYPES } from "@/app/di/types";
import { User } from "@/app/domain/models/User";
import { IRegisterUserService } from "@/app/service/IRegisterUserService";
import { useState } from "react";

/**
 * ユーザー登録のState(状態)と操作を提供するカスタムフック
 */
export const RegisterUserHooks = () => {
    // 状態(State)の定義
    // 処理中(通信中)であるかを判定するためのフラグState
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // バックエンドから返されたエラーメッセージを保持するState
    const [error, setError] = useState<string | null>(null);
    // ✅ 追加：各入力欄（Username, Passwordなど）の下に表示する項目別エラーのState
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // DIコンテナからユースケース(Service)を取得する
    const registerService = container.get<IRegisterUserService>(TYPES.IRegisterUserService);

    // UIから呼び出される登録実行関数
    const register = async (user: User): Promise<boolean> => {
        // 処理開始時にローディング状態をオンにし、エラー状態をリセットする
        setIsLoading(true);
        setError(null);
        setErrors({}); // ✅ 処理開始時に項目別エラーもリセットする
        
        try {
            // ユーザーの重複チェックを実行する
            await registerService.checkExists(user.username, user.email);
            
            // 重複がなければ(例外がスローされなければ)、登録処理を実行する
            await registerService.register(user);
            
            // 処理が全て成功した場合はtrueを返す
            return true;
            
        } catch (err: any) {
            if (err.serverErrors) {
                const messages: string[] = [];
                const mappedErrors: { [key: string]: string } = {};

                Object.keys(err.serverErrors).forEach(key => {
                    // "Username" や "Password" の先頭を小文字にしてマッピング
                    const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
                    const fieldMessages = err.serverErrors[key];
                    
                    // 各入力欄の下に出す用
                    mappedErrors[fieldName] = fieldMessages[0];
                    // 画面上部のアラートに出す用（配列に追加）
                    messages.push(...fieldMessages);
                });

                setErrors(mappedErrors);
                setError(messages.join("\n")); // 複数ある場合は改行で結合
            } else {
                // 通常のエラー（重複エラーメッセージや、予期せぬエラーなど）
                setError(err.message || "予期せぬエラーが発生しました。");
            }
            return false;
            
        } finally {
            // 処理の成功・失敗に関わらず、必ずローディング状態をオフに戻す
            setIsLoading(false);
        }
    };

    // UI層に対して、State(データ)と関数を公開する
    return {
        isLoading,  // コンポーネント側でローディング表示やボタン無効化を制御するための状態
        error,      // コンポーネント側でエラーメッセージを表示するための状態
        errors,     // ✅ 追加：UI側でエラー表示に使う
        setErrors,  // ✅ 追加：UI側で入力変更時にエラーを消すために必要
        register    // コンポーネント側で登録処理を実行するための関数
    };
};