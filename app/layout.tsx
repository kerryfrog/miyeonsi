import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "레트로 미연시 만들기",
  description: "두근두근 레트로 미연시 만들기",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
