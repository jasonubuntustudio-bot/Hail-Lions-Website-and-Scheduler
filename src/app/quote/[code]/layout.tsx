import type { Metadata } from "next";

/** Personal quote links should not be indexed */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  title: "Your quote status",
};

export default function QuoteCodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
