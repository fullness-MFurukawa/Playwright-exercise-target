import { Product } from "../domain/models/Product";

/**
 * 商品キーワード検索サービスインターフェイス
 */
export interface ISearchProductService {
    /**
     * 商品検索を実行する
     * @param keyword 検索キーワード
     * @returns 検索結果の商品のリスト
     */
    execute(keyword: string): Promise<Product[]>;
}