import { Product } from "../domain/models/Product";
import { ProductUpdate } from "../domain/models/ProductUpdate";

/**
 * 商品変更サービスのインターフェイス
 */
export interface IUpdateProductService {
    /**
     * 指定されたIdで商品を取得する
     * @param id 変更対象の商品Id
     * @returns 取得した商品
     */
    getProductById(id: string): Promise<Product>;


    /**
     * 商品名の重複バリデーション
     * @param name 検証する名前
     * @param excludeId (任意) 除外する商品ID
     */
    validateProductName(name: string, excludeId?: string): Promise<void>;

    /**
     * 商品を変更する
     * @param product 変更商品
     * @requires 変更した商品
     */
    updateProduct(product: ProductUpdate): Promise<Product>;
}