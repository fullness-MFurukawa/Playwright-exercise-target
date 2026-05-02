/**
 * メニューのヘッダー
 */
"use client";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  
  // 追加: セッションの認証状態(status)のみを取得
  const { status } = useSession();

  return (
    <header className="border-b border-green-200 bg-green-100 p-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        
        {/* 変更：メインタイトルと演習用のサブタイトルを縦に並べるグループ */}
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-green-900">
            <Link href="/">商品管理システム</Link>
          </h1>
          {/* 追加：Playwright演習用のタイトル */}
          <span className="text-sm font-semibold text-green-700 mt-1">
            Playwright E2Eテスト 演習ターゲット
          </span>
        </div>

        <NavigationMenu>
          {/* 💡 項目が増えたため、スマホなどの狭い画面でも綺麗に折り返せるよう flex-wrap をこっそり付けておくと安全です */}
          <NavigationMenuList className="flex flex-wrap justify-end items-center">
            
            {/* 追加：💡 ログイン中のみステータスを表示 */}
            {status === "authenticated" && (
              <span className="text-sm font-bold text-green-800 bg-green-200 px-3 py-1 rounded-full mr-2">
                ログイン中
              </span>
            )}

            {/* メニュー1：ログイン */}
            {/* 追加：未ログイン時のみ「ログイン」を表示 */}
            {status === "unauthenticated" && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} text-green-900 bg-transparent hover:bg-green-200`}>
                  <Link href="/login">ログイン</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}  

            {/* メニュー2：ログアウト */}
            {/* 追加：ログイン中のみ[ログアウト]を表示 */}
            {status === "authenticated" && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} text-green-900 bg-transparent hover:bg-green-200`}>
                  {/* Buttonに変更して、signOut()関数を呼び出す */}
                  <button onClick={() => signOut({ callbackUrl: "/front" })}>ログアウト</button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}

            {/* メニュー3：ユーザー登録 */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} text-green-900 bg-transparent hover:bg-green-200`}>
                <Link href="/users/register">ユーザー登録</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* メニュー4：商品キーワード検索 */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} text-green-900 bg-transparent hover:bg-green-200`}>
                <Link href="/products/search">商品キーワード検索</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* メニュー5：商品登録 (※/apiが残っていたため修正しました) */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} text-green-900 bg-transparent hover:bg-green-200`}>
                <Link href="/products/register">商品登録</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* メニュー6：商品変更 */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} text-green-900 bg-transparent hover:bg-green-200`}>
                <Link href="/products/update">商品変更</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}