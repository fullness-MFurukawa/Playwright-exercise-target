"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    } from "@/components/ui/table";
import { AlertCircle } from "lucide-react";
import { SearchProductHooks } from "@/components/hooks/SearchProductHooks";

    /**
     * ユーザーからの入力を受け付け、カスタムフック経由で検索処理を呼び出す
     */
    export const ProductSearch = () => {

        // 検索ボックスに入力されたキーワード文字列を保持するローカルState
        const [keyword, setKeyword] = useState<string>("");
        // カスタムフックから検索結果(products)、ローディング状態(isLoading)、検索実行関数(search)を取得する
        // カスタムフックからエラー状態(error)も取得するように変更
        const { products, isLoading, error, search } = SearchProductHooks();
        // 検索ボタンがクリックイベントハンドラ
        const handleSearchClick = () => {
            // 入力されているキーワードを引数に渡し、実際の検索処理(ユースケース)を実行する
            search(keyword);
        };

        /**
         * UIを構成するコンポーネントを返す
         */
        return (
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-6 text-center border-b pb-4">
                    商品キーワード検索
                </h2>
                
                {/* 検索入力エリア */}
                <div className="flex justify-center items-center gap-4 mb-8">
                    <Input 
                        type="text" 
                        value={keyword} 
                        onChange={(e) => setKeyword(e.target.value)} 
                        placeholder="商品名を入力..."
                        className="max-w-sm"
                    />
                    <Button 
                        onClick={handleSearchClick} 
                        disabled={isLoading}
                        className="px-8"
                    >
                        {isLoading ? "検索中..." : "検索"}
                    </Button>
                </div>

                {/* エラーメッセージを表示する */}
                {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                        <AlertCircle className="h-5 w-5" />
                        <span className="font-medium">{error}</span>
                    </div>
                )}
                {/* エラーメッセージを表示する */}

                {/* 検索結果の表示エリア */}
                <div>
                    {/* 商品が見つからない場合のメッセージ */} 
                    {products.length === 0 && !isLoading && (
                        <p className="text-center text-muted-foreground py-4">
                            キーワードを入力して、[検索]ボタンを押してください。
                        </p>
                    )}

                    {/* 商品が見つかった場合のテーブル表示 */}
                    {products.length > 0 && (
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="font-semibold text-foreground">商品名</TableHead>
                                        <TableHead className="font-semibold text-foreground text-right">価格</TableHead>
                                        <TableHead className="font-semibold text-foreground text-center">カテゴリ</TableHead>
                                        <TableHead className="font-semibold text-foreground text-right">在庫</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product) => (
                                        <TableRow key={product.productUuid}>
                                            <TableCell className="font-medium">
                                                {product.name}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                ￥{product.price.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                                    {product.category.name}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {product.stock.stock} <span className="text-muted-foreground text-xs">個</span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>
        );
    };