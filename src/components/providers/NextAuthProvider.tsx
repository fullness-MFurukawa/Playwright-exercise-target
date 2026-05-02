"use client";

import { SessionProvider } from "next-auth/react";
/**
 * NextAuthのSessionProviderでアプリ全体をラップするプロバイダコンポーネント
 */
export const NextAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};