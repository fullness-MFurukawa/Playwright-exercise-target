import { inject, injectable } from "inversify";
import { TYPES } from "@/app/di/types";
import type { IRegisterProductService } from "../IRegisterProductService";
import type { ProductCategory } from "@/app/domain/models/ProductCategory";
import type { ProductRegistration } from "@/app/domain/models/ProductRegistration";
import type { Product } from "@/app/domain/models/Product";
import type { IProductRepository } from "@/app/domain/repository/IProductRepository";
import type { IProductCategoryRepository } from "@/app/domain/repository/IProductCategoryRepository";

/**
 * 商品登録に関する各種データアクセスを統括するサービスサービス
 */
@injectable()
export class RegisterProductService implements IRegisterProductService {

    /**
     * コンストラクタ
     * @param productRepository 商品リポジトリ
     * @param categoryRepository 商品カテゴリリポジトリ
     */
    constructor(
        @inject(TYPES.IProductRepository) private productRepository: IProductRepository,
        @inject(TYPES.IProductCategoryRepository) private categoryRepository: IProductCategoryRepository
    ) {}
    
    /**
     * 画面初期表示時: すべての商品カテゴリを取得する
     * @return すべての商品カテゴリのリスト（非同期）
     */
    async getCategories(): Promise<ProductCategory[]> {
        return await this.categoryRepository.findAll();
    }
    /**
     * カテゴリ選択時: 指定したIDの商品カテゴリ詳細を取得する
     * @param id 商品カテゴリId(UUId)
     * @return 商品カテゴリ（非同期）
     */
    async getCategoryById(id: string): Promise<ProductCategory> {
        return await this.categoryRepository.findById(id);
    }
    /**
     * 入力終了時: 商品名の重複を検証する
     * @param name 入力された商品名
     * @throws 商品名が重複している場合はエラーをスローする
     */
    async validateProductName(name: string): Promise<void> {
        await this.productRepository.existsByName(name);
    }
    /**
     * 登録実行時: 商品データを永続化する
     * @param product 登録する商品データ
     * @return 登録された商品（非同期）
     */
    async execute(product: ProductRegistration): Promise<Product> {
        return await this.productRepository.register(product);
    }
}