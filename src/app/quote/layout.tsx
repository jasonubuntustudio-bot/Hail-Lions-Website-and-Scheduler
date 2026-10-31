import type { Metadata } from "next";
import { PHONE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Check your quote",
  description:
    "Look up your Hail Lions paintless dent repair quote with your confirmation code (HL-XXXX). Accept quotes and schedule online. " +
    PHONE,
  alternates: {
    canonical: "/quote",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function QuoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
