/**
 * 商品登録のためのDTO(インターフェース)
 */
export interface ProductRegistration {
    name: string;              // 商品名
    price: number;             // 価格
    stock: number;             // 在庫数
    categoryId:     string;    // 商品カテゴリId(UUID)
    categoryName:   string;    // 商品カテゴリ名
}