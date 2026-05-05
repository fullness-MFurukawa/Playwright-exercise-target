"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


/**
 * ログインフォームコンポーネント
 */
export const Login = () => {
  const router = useRouter();
  // フォームの入力値を保持するローカルState
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // ログイン処理中のローディング状態を管理するState(ボタンの連打防止)
  const [isLoading, setIsLoading] = useState(false);

  // フォーム送信（ログインボタン押下）時に実行される非同期関数
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault(); // フォームのデフォルトの送信動作(ページリロード)を防ぐ
    setIsLoading(true); // ローディング状態を開始(ボタンを「ログイン中...」にする)    
    // NextAuthのsignIn関数()で認証プロバイダを呼び出す
    const res = await signIn("credentials", {
      usernameOrEmail: username, // 画面で入力されたユーザー名(またはメールアドレス)
      password: password,        // 画面で入力されたパスワード
      redirect: false,           // 処理完了後の自動リダイレクトを無効化
      callbackUrl: "/",          // ログイン成功時のリダイレクト先パス(トップページ)を指定
    });
    if (res?.error) {
      // 失敗時：エラーメッセージをセットしてローディングを解除
      setErrorMessage("ユーザー名またはパスワードが異なります。");
      setIsLoading(false);
    } else if (res?.ok) {
      // 成功時：トップページへ遷移し、ヘッダー等の状態を最新にする
      router.push("/");
      router.refresh(); 
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-lg shadow-sm border border-border">
      <h2 className="text-2xl font-bold text-foreground mb-6 text-center border-b pb-4">
        ログイン
      </h2>
      {/* エラーメッセージの表示エリア */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center font-medium">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* ユーザー名入力エリア */}
        <div>
          <label htmlFor="username-input" className="block text-sm font-medium text-foreground mb-2">
            ユーザー名またはメールアドレス
          </label>
          {/* onChangeイベントハンドラ:
            入力値が変更されるたびに実行される
            イベントオブジェクトから最新の入力値 (e.target.value) を取得し、
            ローカルState(username)を更新することで、Reactの制御されたコンポーネント(Controlled Component)としてUIと状態を同期する
          */}
          <Input 
            id="username-input"
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            autoComplete="one-time-code"
            placeholder="xxxxx"
            required
          />
        </div>

        {/* パスワード入力エリア */}
        <div>
          <label htmlFor="password-input" className="block text-sm font-medium text-foreground mb-2">
            パスワード
          </label>
          {/* 同様に、入力イベントを検知してpassword Stateを同期 */}
          <Input 
            id="password-input"
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            autoComplete="one-time-code"
            placeholder="••••••••"
            required
          />
        </div>

        {/* ログインボタン:
          isLoadingがtrue(処理中)、または入力欄が空の場合はボタンを無効化(disabled)する
        */}
        <Button type="submit" disabled={isLoading || !username || !password} className="w-full mt-2">
          {isLoading ? "ログイン中..." : "ログイン"}
        </Button>
      </form>
    </div>
  );
};