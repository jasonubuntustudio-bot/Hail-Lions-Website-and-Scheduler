import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { PHONE, PHONE_TEL } from "@/lib/utils";

export default function Header() {
  return (
    <header className="border-b border-gray-800 bg-black/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Hail Lions"
            width={44}
            height={44}
            className="rounded-full"
            priority
          />
          <div>
            <span className="text-lg font-bold text-white tracking-tight block leading-tight">
              Hail Lions
            </span>
            <span className="text-xs text-cyan-400">The King of Dent Repair</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <Link href="/services" className="hover:text-cyan-400 transition">
            Services
          </Link>
          <Link href="/areas" className="hover:text-cyan-400 transition">
            Areas
          </Link>
          <Link href="/about" className="hover:text-cyan-400 transition">
            About
          </Link>
          <Link href="/guarantee" className="hover:text-cyan-400 transition">
            Guarantee
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${PHONE_TEL}`}
            className="hidden sm:flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium"
          >
            <Phone size={16} />
            {PHONE}
          </a>
          <Link
            href="/book"
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2 rounded-lg transition text-sm"
          >
            Book Now
          </Link>
        </div>
      </div>
    </header>
  );
}
