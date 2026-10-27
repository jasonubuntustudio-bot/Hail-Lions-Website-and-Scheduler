import type { Metadata } from "next";
import { PHONE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Get a Quote — Upload Photos",
  description:
    "Send vehicle damage photos for a free mobile paintless dent repair quote in Houston. Hail Lions comes to you. Call " +
    PHONE,
  alternates: {
    canonical: "/book",
  },
  openGraph: {
    title: "Get a Quote | Hail Lions",
    description:
      "Upload photos for a fast PDR quote. Mobile service across greater Houston.",
    url: "/book",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
