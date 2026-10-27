import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  title: "Your quote",
};

export default function QuoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
