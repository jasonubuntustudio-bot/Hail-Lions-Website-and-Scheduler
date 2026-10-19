import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PHONE } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

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
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
