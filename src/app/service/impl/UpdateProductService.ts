import { Product } from "@/app/domain/models/Product";
import { IUpdateProductService } from "../IUpdateProductService";
import { inject, injectable } from "inversify";
import type { IProductRepository } from "@/app/domain/repository/IProductRepository";
import { TYPES } from "@/app/di/types";
import { ProductUpdate } from "@/app/domain/models/ProductUpdate";


/**
 * 商品変更サービスインターフェイスの実装
 */
@injectable()
export class UpdateProductService implements IUpdateProductService {
    /**
     * コンストラクタ
     * @param productRepository IProductRepositoryの実装をインジェクションする
     */
    constructor(
        @inject(TYPES.IProductRepository) private productRepository: IProductRepository
    ) {}

    /**
     * 指定されたIdで商品を取得する
     * @param id 変更対象の商品Id
     */
    async getProductById(id: string): Promise<Product> {
        return await this.productRepository.searchById(id);
    }

    /**
     * 商品を変更する
     * @param product 変更商品
     * @requires 変更した商品
     */
    async updateProduct(product: ProductUpdate): Promise<Product> {
        return await this.productRepository.update(product);
    }
}