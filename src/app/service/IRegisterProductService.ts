import { Product } from "../domain/models/Product";
import { ProductCategory } from "../domain/models/ProductCategory";
import { ProductRegistration } from "../domain/models/ProductRegistration";

/**
 * 商品登録サービスのインターフェース
 */
export interface IRegisterProductService {
    /**
     * 画面初期表示時: すべての商品カテゴリを取得する
     * @return すべての商品カテゴリのリスト（非同期）
     */
    getCategories(): Promise<ProductCategory[]>;

    /**
     * カテゴリ選択時: 指定したIDの商品カテゴリ詳細を取得する
     * @param id 商品カテゴリId(UUId)
     * @return 商品カテゴリ（非同期）
     */
    getCategoryById(id: string): Promise<ProductCategory>;

    /**
     * 入力終了時: 商品名の重複を検証する
     * @param name 入力された商品名
     * @throws 商品名が重複している場合はエラーをスローする
     */
    validateProductName(name: string): Promise<void>;

    /**
     * 登録実行時: 商品データを永続化する
     * @param product 登録する商品データ
     * @return 登録された商品（非同期）
     */
    execute(product: ProductRegistration): Promise<Product>;    
}