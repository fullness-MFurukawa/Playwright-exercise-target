/**
 * 商品変更のためのDTO(インターフェース)
 */
export interface ProductUpdate {
    productId:     string;     // 商品Id(UUID)
    name: string;              // 商品名
    price: number;             // 価格
    stock: number;             // 在庫数
}