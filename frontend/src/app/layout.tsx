import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/Layout";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "DevRel Guide",
  description: "A comprehensive collection of Developer Relations resources, tools, and job opportunities.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6E2FD5"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} font-sans antialiased`}>
      <body className="min-h-screen bg-background">
        <div className="min-h-screen flex flex-col">
          <Layout>
            <main className="flex-grow">
              {children}
            </main>
          </Layout>
        </div>
      </body>
    </html>
  );
}