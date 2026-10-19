import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PHONE } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0a",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "Hail Lions | Mobile Paintless Dent Repair Houston",
    template: "%s | Hail Lions",
  },
  description:
    "Houston's mobile paintless dent repair specialists. Hail damage, door dings, creases — we come to you. 100% satisfaction guarantee. Lifetime warranty. Call " +
    PHONE,
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
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-gray-100">
        <Header />
        <main className="flex-1 w-full overflow-x-hidden">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
