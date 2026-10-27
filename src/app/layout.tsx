import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PHONE } from "@/lib/utils";
import { localBusinessJsonLd } from "@/lib/schema";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const site =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://hail-lions-website-and-scheduler.vercel.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0a",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: "Hail Lions | Mobile Paintless Dent Repair Houston",
    template: "%s | Hail Lions",
  },
  description:
    "Houston's mobile paintless dent repair specialists. Hail damage, door dings, creases — we come to you. 100% satisfaction guarantee. Lifetime warranty. Call " +
    PHONE,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Hail Lions",
  },
  formatDetection: {
    telephone: true,
  },
  openGraph: {
    title: "Hail Lions — The King of Dent Repair",
    description:
      "Mobile paintless dent repair across greater Houston. Start with photos for a fast estimate.",
    type: "website",
    locale: "en_US",
    url: site,
    siteName: "Hail Lions",
    images: [
      {
        url: "/images/hero.webp",
        width: 1400,
        height: 900,
        alt: "Hail Lions mobile paintless dent repair — Houston TX",
      },
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Hail Lions logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hail Lions — The King of Dent Repair",
    description:
      "Mobile paintless dent repair across greater Houston. Start with photos for a fast estimate.",
    images: ["/images/hero.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = localBusinessJsonLd();

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-gray-100">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main className="flex-1 w-full overflow-x-hidden">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
