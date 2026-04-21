import type { Metadata } from "next";
import { Sarabun, Lora, Patrick_Hand } from "next/font/google";

import "../index.css";
import Providers from "@/components/providers";

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["latin", "thai"],
  weight: ["400", "600", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  style: ["italic"],
});

const patrickHand = Patrick_Hand({
  variable: "--font-patrick-hand",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "The Unspoken Screen — หน้าจอที่อยากให้ครอบครัวเห็น",
  description:
    "พื้นที่สำหรับสิ่งที่นักศึกษาอยากบอกครอบครัว แต่ไม่รู้จะเริ่มต้นยังไง",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body
        className={`${sarabun.variable} ${lora.variable} ${patrickHand.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
