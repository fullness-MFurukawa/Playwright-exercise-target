import { container } from "@/app/di/container";
import { TYPES } from "@/app/di/types";
import { Product } from "@/app/domain/models/Product";
import { ProductUpdate } from "@/app/domain/models/ProductUpdate";
import { IUpdateProductService } from "@/app/service/IUpdateProductService";
import { ChangeEvent, useCallback, useState } from "react";

/**
 * 商品変更画面の状態管理とイベントハンドリングを行うカスタムHook
 */
export const UpdateProductHooks = () => {
    // --- DIコンテナからサービスを取得 ---
    const service = container.get<IUpdateProductService>(TYPES.IUpdateProductService);

    // --- Stateの定義 ---
    // 検索用
    const [searchId, setSearchId] = useState<string>("");
    const [product, setProduct] = useState<Product | null>(null);
    
    // 編集用フォーム
    const [formData, setFormData] = useState<ProductUpdate>({
        productId: "",
        name: "",
        price: 0,
        stock: 0
    });
    
    // 共通状態
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false); // 検索完了後の「編集モード」管理

    /**
     * 検索状態と編集モードをリセットし、初期状態に戻す
     */
    const resetAll = useCallback(() => {
        setSearchId("");
        setProduct(null);
        setFormData({ productId: "", name: "", price: 0, stock: 0 });
        setError(null);
        setIsSuccess(false);
        setIsEditMode(false);
    }, []);

    /**
     * 商品検索実行イベント
     */
    const handleSearch = useCallback(async () => {
        if (!searchId.trim()) return;

        setIsLoading(true);
        setError(null);
        setProduct(null);
        setIsEditMode(false);

        try {
            const result = await service.getProductById(searchId.trim());
            if (result) {
                setProduct(result);
            }
        } catch (err: any) {
            setError(err.message || "商品の取得中に予期せぬエラーが発生しました。");
        } finally {
            setIsLoading(false);
        }
    }, [searchId, service]);

    /**
     * 検索結果を編集フォームに反映させ、編集モードへ移行する
     */
    const handleStartEdit = useCallback(() => {
        if (!product) return;

        setFormData({
            productId: product.productUuid,
            name: product.name,
            price: product.price,
            stock: product.stock.stock // ネストされたstockから値を取得
        });
        setIsEditMode(true);
    }, [product]);

    /**
     * 編集フォームの入力変更イベント
     */
    const handleUpdateChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            // 数値項目の場合、空文字("")ならそのまま空（または 0）として扱い、
            // 入力がある時だけNumber()で変換する
            [name]: (name === "price" || name === "stock") 
            ? (value === "" ? "" : Number(value)) 
            : value
        }));
    }, []);

    /**
     * [変更を保存する]ボタンクリック データの更新実行
     */
    const handleUpdateSubmit = useCallback(async (): Promise<Product | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await service.updateProduct(formData);
            if (result) {
                setIsSuccess(true);
            }
            return result;
        } catch (err: any) {
            setError(err.message || "商品の更新に失敗しました。");
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [formData, service]);

    return {
        // 検索用
        searchId,
        setSearchId,
        product,
        handleSearch,
        // 編集用
        formData,
        isEditMode,
        handleStartEdit,
        handleUpdateChange,
        handleUpdateSubmit,
        // 共通
        error,
        isLoading,
        isSuccess,
        resetAll
    };
};