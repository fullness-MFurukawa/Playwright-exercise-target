/**
 * メニューのレイアウト
 */
import "@/app/globals.css"; // CSSを読み込む
import Header from "./header";
import Footer from "./footer";

// 💡 レイアウトコンポーネント
export default function FrontMenuLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="flex flex-col min-h-screen bg-slate-50 font-sans">
        <Header /> 
        <main className="flex-1 container mx-auto p-4 md:p-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}