import Image from "next/image";
import Link from "next/link";
import { PHONE, PHONE_TEL } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black py-10 sm:py-12 safe-bottom">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="Hail Lions" width={40} height={40} />
              <div>
                <span className="font-bold text-white block">Hail Lions</span>
                <span className="text-xs text-cyan-400">The King of Dent Repair</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Mobile paintless dent repair across greater Houston. We come to
              you. 100% satisfaction guarantee. Lifetime warranty.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Services</h4>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>
                <Link href="/services/paintless-dent-repair" className="hover:text-cyan-400 block py-2">
                  Paintless Dent Repair
                </Link>
              </li>
              <li>
                <Link href="/services/hail-damage-repair" className="hover:text-cyan-400 block py-2">
                  Hail Damage Repair
                </Link>
              </li>
              <li>
                <Link href="/services/mobile-dent-repair" className="hover:text-cyan-400 block py-2">
                  Mobile Dent Repair
                </Link>
              </li>
              <li>
                <Link href="/services/classic-car-pdr" className="hover:text-cyan-400">
                  Classic Car PDR
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Contact</h4>
            <p className="text-sm text-gray-400 mb-2">
              <a href={`tel:${PHONE_TEL}`} className="text-cyan-400 hover:underline">
                {PHONE}
              </a>
            </p>
            <p className="text-sm text-gray-500 mb-1">Jason Huddleston · Co-Owner</p>
            <p className="text-sm text-gray-600 mb-4">[Second Owner] · Co-Owner</p>
            <p className="text-sm text-gray-400 mb-4">Houston, TX & surrounding areas</p>
            <Link
              href="/book"
              className="inline-block bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2.5 rounded-lg text-sm transition min-h-[44px]"
            >
              Start with Photos
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <span>© {new Date().getFullYear()} Hail Lions LLC. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-cyan-400">
              About
            </Link>
            <Link href="/guarantee" className="hover:text-cyan-400">
              Guarantee
            </Link>
            <Link href="/contact" className="hover:text-cyan-400">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
