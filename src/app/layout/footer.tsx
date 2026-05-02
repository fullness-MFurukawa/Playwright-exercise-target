/**
 * メニューのフッター
 */
export default function Footer() {
  return (
    <footer className="bg-green-100 border-t border-green-200 p-4 text-center text-sm text-green-900 mt-auto">
      &copy; {new Date().getFullYear()} Fullness,Inc. All Rights Reserved.
    </footer>
  );
}