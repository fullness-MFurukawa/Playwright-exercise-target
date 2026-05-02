import { ProductCategory } from "./ProductCategory";
import { ProductStock } from "./ProductStock";
/**
 * 商品インターフェイス
 */
export interface Product {
    productUuid: string;    // 商品Id(UUID)
    name: string;           // 商品名
    price: number;          // 単価
    category: ProductCategory;  // 商品カテゴリ
    stock:    ProductStock;     // 商品在庫数     
}