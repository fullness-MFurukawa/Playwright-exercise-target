import { injectable } from "inversify";
import { IProductRepository } from "../domain/repository/IProductRepository";
import { Product } from "../domain/models/Product";
import { getSession } from "next-auth/react";
import { ProductRegistration } from "../domain/models/ProductRegistration";
import { ProductUpdate } from "../domain/models/ProductUpdate";

/**
 * IProductRepositoryインターフェイス実装
 */
@injectable()
export class ProductRepository implements IProductRepository {
    
     /**
     * 指定したIdで商品を検索して取得する
     * @param id 商品Id
     * @returns 検索にヒットした商品（非同期）
     */
    public async searchById(id: string): Promise<Product> {
         // NextAuthのセッションからアクセストークンを取得
        const session = await getSession();
        const token = (session as any)?.user?.token;
       
        // API呼び出し(next.config.tsで設定したプロキシ経由)
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
        const response = await fetch(`${apiBaseUrl}/products/update/product/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        // Statusが200以外の場合
        if (!response.ok) {
            const errors: ErrorResponse = await response.json();
            throw new Error(errors.message);
        }
        // 成功時は商品(JSON)をパースして返却
        const products: Product = await response.json();
        return products;
    }

    /**
     * 指定したキーワードで商品を検索する
     * @param keyword 検索キーワード
     * @returns 検索結果の商品リスト
     */
    public async searchKeyword(keyword: string): Promise<Product[]> {
        // NextAuthのセッションからアクセストークンを取得
        const session = await getSession();
        const token = (session as any)?.user?.token;

        // 検索クエリパラメータの構築
        const params = new URLSearchParams({ keyword: keyword });

        // API呼び出し(next.config.tsで設定したプロキシ経由)
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
        const response = await fetch(`${apiBaseUrl}/products/search?${params.toString()}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        // ステータスコードに応じたエラーハンドリング
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            // バックエンドで設定した "message" (検索キーワードを入力してください。等) があればそれを投げる
            if (errorData.message) {
                throw new Error(errorData.message);
            }
            // それ以外のエラーへの対応
            if (errorData.errors) {
                const messages = Object.values(errorData.errors).flat().join("\n");
                throw new Error(messages);
            }
            throw new Error(`検索に失敗しました (Status: ${response.status})`);
        }

        // 成功時は商品リスト(JSON)をパースして返却
        const products: Product[] = await response.json();
        if (products.length === 0) {
            throw new Error(`${keyword}を含む商品は、見つかりませんでした。`);
        }
        return products;
    }

    // --- オーバーロード用シグネチャ ---
    async existsByName(name: string): Promise<void>;
    async existsByName(name: string, excludeId: string): Promise<void>;

    async existsByName(name: string, excludeId?: string): Promise<void> {
        const session = await getSession();
        const token = (session as any)?.user?.token;

        // クエリパラメータの設定
        const params = new URLSearchParams({ productName: name });

        if (excludeId) {
            params.append("excludeId", excludeId);
        }

        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
        const response = await fetch(`${apiBaseUrl}/products/register/validate?${params.toString()}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        // ✅ エラー(TS2416)の解決策：
        // インターフェースが期待している戻り値(void)と一致させる
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            if (errorData.message) {
                throw new Error(errorData.message);
            }
        }
        // response.ok の場合は何も返さず終了(void)
    }


    /**
     * 商品を登録する
     * @param product 登録する商品
     * @returns 登録された商品（非同期）
     */
    async register(product: ProductRegistration): Promise<Product> {
        const session = await getSession();
        const token = (session as any)?.user?.token;
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
        const response = await fetch(`${apiBaseUrl}/products/register`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product) // DTOをJSON文字列に変換して送信
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            if (errorData.message) {
                throw new Error(errorData.message);
            }
            if (errorData.errors) {
                const messages = Object.values(errorData.errors).flat().join("\n");
                throw new Error(messages);
            }
            throw new Error(`商品の登録に失敗しました (Status: ${response.status})`);
        }
        // 登録完了後、バックエンドから返却された完全な商品データ(UUID含む)を返す
        return await response.json();
    }           


    /**
     * 商品を変更する
     * @param product 変更する商品
     * @returns 変更された商品（非同期）
     */
    async update(product: ProductUpdate): Promise<Product> {
        const session = await getSession();
        const token = (session as any)?.user?.token;
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
        const response = await fetch(`${apiBaseUrl}/products/update`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product) // DTOをJSON文字列に変換して送信
        });

        // Statusが200以外の場合
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            // カスタム例外 (ExistsException 等、messageプロパティがある場合)
            if (errorData.message) {
                throw new Error(errorData.message);
            }
            // 標準バリデーションエラー (Problem Details形式)
            if (errorData.errors) {
                // エラーオブジェクトそのものを保持したカスタムエラーを投げる
                const validationError = new Error("バリデーションエラーが発生しました。");
                (validationError as any).serverErrors = errorData.errors; // ここに項目別エラーを格納
                throw validationError;
            }
            throw new Error(errorData.title || "商品の更新に失敗しました。");
        }
        return await response.json();
    }   
}