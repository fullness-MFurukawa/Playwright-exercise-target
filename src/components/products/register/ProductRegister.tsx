"use client";
import { RegisterProductHooks } from "@/components/hooks/RegisterProductHooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";


/**
 * 演習8-12 商品登録画面コンポーネントの実装と動作確認
 * 商品登録画面のUIコンポーネント
 */
export const ProductRegister = () => {
    const router = useRouter();
    
    // カスタムHookから状態と関数を取得
    const { 
        formData, 
        categories, 
        errors, 
        isLoading, 
        isSuccess,
        handleChange, 
        handleCategoryChange, 
        handleNameBlur, 
        handleSubmit,
        resetForm    
    } = RegisterProductHooks();

    // フォーム送信時のUI側イベントハンドラ
    const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault(); // デフォルトの画面遷移を防止
        await handleSubmit(); // Hookの送信処理を実行
    };

    return (
        <>
        <div className="container mx-auto py-10 max-w-lg">
            <h1 className="text-2xl font-bold mb-6">商品新規登録</h1>
            
            <form onSubmit={onSubmit} className="space-y-6">
                {/* 商品名入力 */}
                <div className="space-y-2">
                    <Label htmlFor="name">商品名</Label>
                    <Input 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleNameBlur} // フォーカスアウト時に検証実行
                        placeholder="例：高性能ワイヤレスマウス"
                        required
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                {/* カテゴリ選択 */}
                    <div className="space-y-2">
                        <Label htmlFor="categoryId">カテゴリ</Label>
                        <Select value={formData.categoryId} onValueChange={handleCategoryChange} required>
                            <SelectTrigger>
                                <SelectValue placeholder="カテゴリを選択してください" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.categoryUuid} value={cat.categoryUuid}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                    </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* 価格入力 */}
                    <div className="space-y-2">
                        <Label htmlFor="price">価格</Label>
                        <Input 
                            id="price"
                            name="price"
                            type="number"
                            value={formData.price || ""}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>

                    {/* 在庫数入力 */}
                    <div className="space-y-2">
                        <Label htmlFor="stock">在庫数</Label>
                        <Input 
                            id="stock"
                            name="stock"
                            type="number"
                            value={formData.stock || ""}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>
                </div>

                {/* 通信エラー等の表示 */}
                {errors.submit && <p className="text-sm text-red-500">{errors.submit}</p>}
                {errors.system && <p className="text-sm text-red-500">{errors.system}</p>}

                {/* 登録ボタン */}
                <div className="flex justify-end pt-4">
                    <Button type="submit" className="w-48" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                登録中...
                            </>
                        ) : (
                            "商品を登録する"
                        )}
                    </Button>
                </div>
            </form>
        </div>
        {/* ★ カスタムHookの isSuccess に応じてモーダルを表示 */}
        {isSuccess && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
                    <h3 className="text-xl font-bold mb-4">登録完了</h3>
                    <p className="text-gray-600 mb-8">商品の登録が完了しました。</p>
                    <Button 
                        // ユーザーが「確認」を押したタイミングで入力画面へ遷移
                        onClick={resetForm} 
                        className="w-full">
                            入力画面に戻る
                        </Button>
                    </div>
                </div>
        )}
        </>
    );
};