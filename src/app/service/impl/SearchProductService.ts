import { injectable, inject } from "inversify";
import type { ISearchProductService } from "../ISearchProductService";
import type { IProductRepository } from "@/app/domain/repository/IProductRepository";
import type { Product } from "@/app/domain/models/Product";
import { TYPES } from "@/app/di/types";


/**
 * 商品キーワード検索サービスインターフェイスの実装
 */
@injectable()
export class SearchProductService implements ISearchProductService {
    
    /**
     * コンストラクタ
     * @param productRepository IProductRepositoryの実装をインジェクションする
     */
    constructor(
        @inject(TYPES.IProductRepository) private productRepository: IProductRepository
    ) {}
  
    /**
     * 商品検索を実行する
     * @param keyword 検索キーワード
     * @returns 検索結果の商品のリスト
     */
    public async execute(keyword: string): Promise<Product[]> {
        // ユースケース固有のビジネスロジックをここに記述可能
        return await this.productRepository.searchKeyword(keyword);
    }
}