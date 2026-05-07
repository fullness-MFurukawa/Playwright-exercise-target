import { container } from "@/app/di/container";
import { TYPES } from "@/app/di/types";
import { Product } from "@/app/domain/models/Product";
import { ProductUpdate } from "@/app/domain/models/ProductUpdate";
import { IUpdateProductService } from "@/app/service/IUpdateProductService";
import { ChangeEvent, useCallback, useState } from "react";

export const UpdateProductHooks = () => {
    const service = container.get<IUpdateProductService>(TYPES.IUpdateProductService);

    const [searchId, setSearchId] = useState<string>("");
    const [product, setProduct] = useState<Product | null>(null);
    
    const [formData, setFormData] = useState<ProductUpdate>({
        productId: "",
        name: "",
        price: 0,
        stock: 0
    });
    
    // --- 修正:フィールド別のエラー状態を追加 ---
    const [errors, setErrors] = useState<{ name?: string; price?: string; stock?: string; }>({});
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);

    const resetAll = useCallback(() => {
        setSearchId("");
        setProduct(null);
        setFormData({ productId: "", name: "", price: 0, stock: 0 });
        setErrors({}); // リセット
        setError(null);
        setIsSuccess(false);
        setIsEditMode(false);
    }, []);

    /**
     * --- 修正: 商品名重複のリアルタイム検証 ---
     */
    const handleNameBlur = useCallback(async () => {
        if (!formData.name.trim()) return;

        // 現在入力されている名前が同じなら、チェック処理をスキップする
        if (product && formData.name === product.name) {
            // 元の名前と同じならエラーにする必要がないので、nameエラーを消して終了
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.name;
                return newErrors;
            });
            return;
        }

        try {
            // 第2引数に現在の商品のUUIDを渡すことで、自分自身を除外してチェック
            await service.validateProductName(formData.name, formData.productId);
            
            // 成功（重複なし）ならエラーを消去
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.name;
                return newErrors;
            });
        } catch (err: any) {
            // 重複がある場合やエラーの場合
            setErrors(prev => ({ ...prev, name: err.message }));
        }
    }, [formData.name, formData.productId, service]);

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

    const handleStartEdit = useCallback(() => {
        if (!product) return;
        setFormData({
            productId: product.productUuid,
            name: product.name,
            price: product.price,
            stock: product.stock.stock
        });
        setErrors({}); // モード切替時にクリア
        setIsEditMode(true);
    }, [product]);

    const handleUpdateChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: (name === "price" || name === "stock") 
            ? (value === "" ? "" : Number(value)) 
            : value
        }));
        
        setErrors(prev => {
            const newErrors = { ...prev };
            delete (newErrors as any)[name]; // price や stock も消せるようにする
            return newErrors;
        });
    }, []);

    const handleUpdateSubmit = useCallback(async (): Promise<Product | null> => {
        // --- 修正ポイント3: バリデーションエラーがある場合は中断 ---
        //if (Object.keys(errors).length > 0) {
        //    setError("入力内容にエラーがあります。修正してください。");
        //    return null;
        //}

        setIsLoading(true);
        setError(null);
        try {
            const result = await service.updateProduct(formData);
            if (result) {
                setIsSuccess(true);
            }
            return result;
        } catch (err: any) {
            
            if (err.serverErrors) {
                // 共通アラート表示用のメッセージ配列
                const messages: string[] = [];
                // バックエンドの "Price" などのキーを、フロントの "price" にマッピング
                const mappedErrors: { [key: string]: string } = {};
                Object.keys(err.serverErrors).forEach(key => {
                    const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
                    const fieldMessages = err.serverErrors[key];
                    mappedErrors[fieldName] = fieldMessages[0];
                    messages.push(...fieldMessages);
                });
                setErrors(mappedErrors); 
                setError(messages.join("\n"));
            } else {
                setError(err.message);
            }
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [formData, service, errors]);

    return {
        searchId,
        setSearchId,
        product,
        handleSearch,
        formData,
        isEditMode,
        handleStartEdit,
        handleUpdateChange,
        handleNameBlur, 
        handleUpdateSubmit,
        error,
        errors,       
        isLoading,
        isSuccess,
        resetAll
    };
};