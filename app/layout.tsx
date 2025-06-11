import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "トーラムスミス成功率計算",
  description: "トーラムオンラインのスミス成功率計算ツール",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
