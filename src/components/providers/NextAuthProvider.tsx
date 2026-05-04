"use client";

import { SessionProvider } from "next-auth/react";
/**
 * NextAuthのSessionProviderでアプリ全体をラップするプロバイダコンポーネント
 */
export const NextAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (<SessionProvider 
          basePath="/front/api/auth"
          refetchInterval={60} // 60秒ごとにセッションの状態を確認する
          refetchOnWindowFocus={true} // ウィンドウにフォーカスが戻った時(タブの切り替えなど)でも確認する
          >
          
      {children}
     </SessionProvider>);
};