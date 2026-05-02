import { ProductSearch } from "@/components/products/search/ProductSearch";
/**
 * 商品キーワード検索ページ
 * URL: /products/search
 */
export default function ProductSearchPage() {
  return (
    <main className="container mx-auto py-8">
      <ProductSearch />
    </main>
  );
}