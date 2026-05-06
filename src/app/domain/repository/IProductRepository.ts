import { Product } from "../models/Product";
import { ProductRegistration } from "../models/ProductRegistration";
import { ProductUpdate } from "../models/ProductUpdate";
/**
 * 商品リポジトリインターフェース
 */
export interface IProductRepository {

    /**
     * 指定したIdで商品を検索して取得する
     * @param id 商品Id
     * @returns 検索にヒットした商品（非同期）
     */
    searchById(id: string): Promise<Product>;

    /**
     * 指定したキーワードで商品を検索して取得する
     * @param keyword 検索キーワード
     * @returns 検索にヒットした商品のリスト（非同期）
     */
    searchKeyword(keyword: string): Promise<Product[]>;

    /**
     * 商品の重複を検証する
     * @param name 検証する商品名
     */
    existsByName(name: string): Promise<void>;

    /**
     * 商品の重複を検証する
     * 更新用のシグネチャ（オーバーロード）
     * @param name 検証する商品名
     */
    existsByName(name: string, excludeId: string): Promise<void>;

    /**
     * 商品を登録する
     * @param product 登録する商品
     * @returns 登録された商品（非同期）
     */
    register(product: ProductRegistration): Promise<Product>;

    /**
     * 商品を変更する
     * @param product 変更する商品
     * @returns 変更された商品（非同期）
     */
    update(product: ProductUpdate): Promise<Product>;
}