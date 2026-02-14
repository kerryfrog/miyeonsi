import type { Metadata } from "next";
import { Song_Myung } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const songMyung = Song_Myung({
  weight: "400",
  variable: "--font-song-myung",
});

export const metadata: Metadata = {
  title: "레트로 미연시 만들기",
  description: "두근두근 레트로 미연시 만들기",
  openGraph: {
    images: ["/meta_image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={songMyung.variable}>
      <body className="antialiased">
        <Script
          id="adsense-script"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2881048601217100"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
