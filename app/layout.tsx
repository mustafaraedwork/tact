import type { Metadata } from "next";
import { Cairo, IBM_Plex_Sans_Arabic } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import ToastProvider from "@/components/providers/ToastProvider";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import FacebookPixel from "@/components/FacebookPixel";

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700", "800"],
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-ibm",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TACT Kitchens | مطابخ تاكت",
  description: "مطابخ خشبية عصرية بجودة عالية وتصاميم مميزة في بغداد",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.variable} ${ibmPlexSansArabic.variable} font-body antialiased bg-background-secondary`}
      >
        {children}
        <ToastProvider />
        <Suspense fallback={null}>
          <AnalyticsTracker />
          <FacebookPixel />
        </Suspense>
      </body>
    </html>
  );
}