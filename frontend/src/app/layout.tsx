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

const SITE_URL = 'https://learndevrel.com';
const SITE_NAME = 'DevRel Guide';
const SITE_TITLE = 'DevRel Guide — Developer Relations Resources, Programs, and Jobs';
const SITE_DESC = 'Developer Relations playbook: curated resources, DevRel program templates, blog posts, and live job opportunities for developer advocates and community builders.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | DevRel Guide',
  },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  authors: [{ name: 'Rohit Ghumare', url: 'https://github.com/rohitg00' }],
  keywords: [
    'Developer Relations',
    'DevRel',
    'Developer Advocate',
    'Developer Marketing',
    'Community Building',
    'DevRel jobs',
    'DevRel programs',
    'DevRel resources',
    'Developer Experience',
  ],
  category: 'technology',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/Icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/Icon.svg',
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESC,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESC,
    creator: '@rohitg00',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': `${SITE_URL}#organization`,
                  name: SITE_NAME,
                  url: SITE_URL,
                  logo: `${SITE_URL}/Icon.svg`,
                  sameAs: [
                    'https://github.com/rohitg00/devrelguide',
                    'https://twitter.com/devrelasservice',
                    'https://linkedin.com/company/devrel-as-service',
                  ],
                },
                {
                  '@type': 'WebSite',
                  '@id': `${SITE_URL}#website`,
                  url: SITE_URL,
                  name: SITE_NAME,
                  description: SITE_DESC,
                  publisher: { '@id': `${SITE_URL}#organization` },
                  inLanguage: 'en-US',
                },
              ],
            }),
          }}
        />
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
