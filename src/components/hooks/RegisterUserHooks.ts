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

    // DIコンテナからユースケース(Service)を取得する
    const registerService = container.get<IRegisterUserService>(TYPES.IRegisterUserService);

    // UIから呼び出される登録実行関数
    const register = async (user: User): Promise<boolean> => {
        // 処理開始時にローディング状態をオンにし、エラー状態をリセットする
        setIsLoading(true);
        setError(null);
        
        try {
            // ユーザーの重複チェックを実行する
            await registerService.checkExists(user.username, user.email);
            
            // 重複がなければ(例外がスローされなければ)、登録処理を実行する
            await registerService.register(user);
            
            // 処理が全て成功した場合はtrueを返す
            return true;
            
        } catch (err: any) {
            // 処理中に例外が発生した場合(重複やAPIエラーなど)は、エラーメッセージをStateにセットする
            setError(err.message || "予期せぬエラーが発生しました。");
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
        register    // コンポーネント側で登録処理を実行するための関数
    };
};