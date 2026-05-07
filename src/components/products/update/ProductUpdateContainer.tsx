"use client";

import { UpdateProductHooks } from "@/components/hooks/UpdateProductHooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Search, Package, Coins, Hash, AlertCircle, Save, Undo2, CheckCircle2 } from "lucide-react";

/**
 * 商品変更機能：統合コンポーネント
 * 検索（Step1と編集（Step 2）の状態を切り替えて表示します。
 */
export const ProductUpdateContainer = () => {
    const {
        searchId,
        setSearchId,
        product,
        formData,
        isEditMode,
        error,
        errors,
        isLoading,
        isSuccess,
        handleSearch,
        handleStartEdit,
        handleUpdateChange,
        handleUpdateSubmit,
        handleNameBlur,
        resetAll
    } = UpdateProductHooks();

    // 検索実行
    const onSearchSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        await handleSearch();
    };

    // 更新実行
    const onUpdateSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        await handleUpdateSubmit();
    };

    return (
        <div className="container mx-auto py-10 max-w-lg space-y-8 text-slate-900">
            <header className="border-b border-slate-200 pb-4">
                <h1 className="text-2xl font-bold">商品情報の変更</h1>
                <p className="text-sm text-slate-500 mt-1">
                    {!isEditMode ? "変更対象の商品をIDで特定してください。" : "新しい情報を入力して保存してください。"}
                </p>
            </header>

            {/* --- 共通エラー表示 --- */}
            {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-900 animate-in fade-in">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-red-600" />
                    <div>
                        {/*
                        <p className="text-sm font-bold">エラーが発生しました</p>
                        */}
                        <p className="text-sm font-bold opacity-80 whitespace-pre-line">{error}</p>
                    </div>
                </div>
            )}

            {/* --- 表示切り替えロジック --- */}
            {!isEditMode ? (
                /* ステップ1：検索ビュー */
                <div className="space-y-6 animate-in fade-in">
                    <form onSubmit={onSearchSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="searchId">検索：商品UUID</Label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    id="searchId"
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                    className="pl-9"
                                    placeholder="UUIDを入力"
                                    required
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <Search className="h-4 w-4 mr-2" />}
                            商品を検索
                        </Button>
                    </form>

                    {/* 検索結果プレビュー */}
                    {product && (
                        <div className="p-6 border border-slate-200 rounded-xl space-y-6 shadow-sm">
                            <div className="flex items-center gap-2 font-bold text-slate-700 border-b pb-2">
                                <Package className="h-5 w-5 text-blue-600" />
                                現在の登録内容
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-slate-400 font-bold text-[10px] uppercase">商品名</p>
                                    <p className="font-semibold text-base">{product.name}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 font-bold text-[10px] uppercase">価格</p>
                                    <p className="font-semibold text-base">{product.price.toLocaleString()}円</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 font-bold text-[10px] uppercase">在庫数</p>
                                    <p className="font-semibold text-base">{product.stock.stock}</p>
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <Button onClick={handleStartEdit} className="bg-blue-600 hover:bg-blue-700">
                                    この内容を変更する
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* ステップ2：編集フォームビュー */
                <form onSubmit={onUpdateSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    {/*
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-slate-500">
                        <span className="font-bold">Editing UUID:</span> {formData.productId}
                    </div>
                    */}

                    <div className="space-y-2">
                        <Label htmlFor="name">商品名</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleUpdateChange}
                            onBlur={handleNameBlur}
                            className={errors.name ? "border-red-500" : ""}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">価格</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                value={formData.price === 0 ? "" : formData.price}
                                onChange={handleUpdateChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock">在庫数</Label>
                            <Input
                                id="stock"
                                name="stock"
                                type="number"
                                value={formData.stock === 0 ? "" : formData.stock}
                                onChange={handleUpdateChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={resetAll} className="flex-1">
                            <Undo2 className="h-4 w-4 mr-2" /> キャンセル
                        </Button>
                        <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" 
                            disabled={isLoading || Object.keys(errors).length > 0}>
                            {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4 mr-2" />}
                            変更を保存
                        </Button>
                    </div>
                </form>
            )}

            {/* --- 完了通知（モーダル） --- */}
            {isSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-xs w-full mx-4 space-y-6">
                        <div className="flex justify-center">
                            <div className="p-3 bg-green-100 rounded-full">
                                <CheckCircle2 className="h-10 w-10 text-green-600" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-slate-900">更新完了</h3>
                            <p className="text-sm text-slate-500">商品情報の更新が正常に終了しました。</p>
                        </div>
                        <Button onClick={resetAll} className="w-full">
                            商品検索へ戻る
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};