import { container } from "@/app/di/container";
import { TYPES } from "@/app/di/types";
import { Product } from "@/app/domain/models/Product";
import { IUpdateProductService } from "@/app/service/IUpdateProductService";
import { useCallback, useState } from "react";

/**
 * 商品変更画面（検索ステップ）の状態管理とイベントハンドリングを行うカスタムHook
 */
export const UpdateProductSearchHooks = () => {
    // --- DIコンテナからサービスを取得 ---
    const service = container.get<IUpdateProductService>(TYPES.IUpdateProductService);

    // --- Stateの定義 ---
    const [searchId, setSearchId] = useState<string>("");         // 検索窓に入力されたID
    const [product, setProduct] = useState<Product | null>(null); // 取得に成功した商品情報
    const [error, setError] = useState<string | null>(null);      // エラーメッセージ
    const [isLoading, setIsLoading] = useState<boolean>(false);   // ローディング状態

    /**
     * 検索状態をリセットし、初期状態に戻す
     */
    const resetSearch = useCallback(() => {
        setSearchId("");
        setProduct(null);
        setError(null);
    }, []);

    /**
     * 商品検索実行イベント
     * サービスを介してリポジトリから商品情報を取得する
     */
    const handleSearch = useCallback(async () => {
        if (!searchId.trim()) return;

        // 検索開始時に状態をクリーンアップ
        setIsLoading(true);
        setError(null);
        setProduct(null);

        try {
            // サービス経由で商品を取得
            const result = await service.getProductById(searchId);
            
            if (result) {
                setProduct(result);
            } else {
                // 基本的にService側やRepository側でNotFound例外が投げられない場合のガード
                setError(`商品ID: ${searchId} は見つかりませんでした。`);
            }
        } catch (err: any) {
            // APIルートやリポジトリから返されるエラーメッセージを捕捉
            // 仕様にある「商品Id:xxxの商品は存在しません」等のメッセージを表示
            setError(err.message || "商品の取得中に予期せぬエラーが発生しました。");
        } finally {
            setIsLoading(false);
        }
    }, [searchId, service]);

    /**
     * 検索入力欄の変更イベント
     */
    const handleSearchIdChange = useCallback((value: string) => {
        setSearchId(value);
    }, []);

    // UIコンポーネントに必要なプロパティと関数を公開
    return {
        searchId,
        product,
        error,
        isLoading,
        handleSearchIdChange,
        handleSearch,
        resetSearch
    };
};