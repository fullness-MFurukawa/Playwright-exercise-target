import { ProductCategory } from "../models/ProductCategory";

/**
 * 商品カテゴリリポジトリインターフェース
 */
export interface IProductCategoryRepository {
    /**
     * すべての商品カテゴリを取得する
     * @returns すべての商品カテゴリのリスト（非同期）
     */
    findAll(): Promise<ProductCategory[]>;
    /**
     * 指定したIDの商品カテゴリを取得する
     * @param id 商品カテゴリId(UUId)
     * @returns 商品カテゴリ（非同期）
     */
    findById(id: string): Promise<ProductCategory>;
}