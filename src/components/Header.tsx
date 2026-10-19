"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Menu, X } from "lucide-react";
import { PHONE, PHONE_TEL } from "@/lib/utils";

const NAV = [
  { href: "/services", label: "Services" },
  { href: "/areas", label: "Areas" },
  { href: "/about", label: "About" },
  { href: "/guarantee", label: "Guarantee" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-800 bg-black/95 backdrop-blur sticky top-0 z-50 safe-top">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        <Link
          href="/"
          className="flex items-center gap-2 min-w-0"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logo.png"
            alt="Hail Lions"
            width={40}
            height={40}
            className="rounded-full shrink-0"
            priority
          />
          <div className="min-w-0">
            <span className="text-base sm:text-lg font-bold text-white tracking-tight block leading-tight truncate">
              Hail Lions
            </span>
            <span className="text-[10px] sm:text-xs text-cyan-400 hidden xs:block">
              The King of Dent Repair
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-sm text-gray-300">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-cyan-400 transition py-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`tel:${PHONE_TEL}`}
            className="flex items-center justify-center w-11 h-11 rounded-full text-cyan-400 hover:bg-cyan-500/10 active:bg-cyan-500/20 transition"
            aria-label={`Call ${PHONE}`}
          >
            <Phone size={22} />
          </a>
          <Link
            href="/book"
            className="bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-300 text-black font-semibold px-3 sm:px-4 py-2.5 rounded-lg transition text-sm min-h-[44px] flex items-center"
            onClick={() => setOpen(false)}
          >
            Book
          </Link>
          <button
            type="button"
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-lg text-gray-300 hover:bg-gray-800 active:bg-gray-700"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-800 bg-black px-3 pb-4 pt-2">
          <nav className="flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-200 py-3.5 px-2 text-base border-b border-gray-900 active:bg-gray-900 rounded-lg"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`tel:${PHONE_TEL}`}
              className="flex items-center gap-2 text-cyan-400 py-3.5 px-2 text-base font-medium"
            >
              <Phone size={18} />
              {PHONE}
            </a>
            <Link
              href="/book"
              className="mt-2 bg-cyan-500 text-black font-bold text-center py-3.5 rounded-xl active:bg-cyan-400"
              onClick={() => setOpen(false)}
            >
              Start with Photos
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
