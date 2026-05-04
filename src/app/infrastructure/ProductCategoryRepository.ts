import { injectable } from "inversify";
import { IProductCategoryRepository } from "../domain/repository/IProductCategoryRepository";
import { ProductCategory } from "../domain/models/ProductCategory";
import { getSession } from "next-auth/react";

/**
 * IProductCategoryRepositoryインターフェイス実装
 */
@injectable()
export class ProductCategoryRepository implements IProductCategoryRepository {
    /**
     * すべての商品カテゴリを取得する
     * @returns すべての商品カテゴリのリスト（非同期）
     */
    async findAll(): Promise<ProductCategory[]> {
        const session = await getSession();
        const token = (session as any)?.user?.token;
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
        `${apiBaseUrl}/products/register/categories}`
        const response = await fetch(`${apiBaseUrl}/products/register/categories`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("商品カテゴリの取得に失敗しました。");
        }
        return await response.json();
    }
    /**
     * 指定したIDの商品カテゴリを取得する
     * @param id 商品カテゴリId(UUId)
     * @returns 商品カテゴリ（非同期）
     */
    async findById(id: string): Promise<ProductCategory> {
        const session = await getSession();
        const token = (session as any)?.user?.token;
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
        const response = await fetch(`${apiBaseUrl}/products/register/categories/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("商品カテゴリ詳細の取得に失敗しました。");
        }
        return await response.json();
    }
}