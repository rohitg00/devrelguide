import type { Metadata } from "next";
import { Roboto_Mono, Architects_Daughter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/Layout";
import { CTABanner } from '@/components/ui/cta-banner'
import { ThemeProvider } from "@/context/ThemeContext";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
});

const architectsDaughter = Architects_Daughter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  variable: "--font-hand",
});

export const metadata: Metadata = {
  title: "DevRel Guide",
  description: "A comprehensive collection of Developer Relations resources, tools, and job opportunities.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/Icon.svg", type: "image/svg+xml" },
    ],
    apple: "/Icon.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#003366"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${robotoMono.variable} ${architectsDaughter.variable} font-mono antialiased dark`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(t)}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Layout>
              <main className="flex-grow">
                {children}
                <CTABanner />
              </main>
            </Layout>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
