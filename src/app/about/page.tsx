import Link from "next/link";
import { Phone, User, Camera } from "lucide-react";
import {
  PHONE,
  PHONE_TEL,
  OWNER_1_NAME,
  OWNER_1_TITLE,
  OWNER_2_NAME,
  OWNER_2_TITLE,
  OWNER_2_PHONE,
  OWNER_2_PHONE_TEL,
  BUSINESS_NAME,
} from "@/lib/utils";

export const metadata = {
  title: "About Hail Lions | Mobile Paintless Dent Repair Houston TX",
  description:
    "Meet Jason Huddleston and Derrick Fraser, co-owners of Hail Lions LLC — mobile paintless dent repair across greater Houston. Honesty, integrity, pride.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
      <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
        About Hail Lions
      </h1>
      <p className="mb-8 text-lg text-cyan-400">
        Mobile paintless dent repair for greater Houston
      </p>

      <div className="space-y-6 leading-relaxed text-gray-300">
        <p>
          {BUSINESS_NAME} LLC is a fully mobile paintless dent repair company
          serving Houston, Katy, Cypress, The Woodlands, Baytown, and surrounding
          communities. We built the business around three ideas: highest quality
          work, a real satisfaction guarantee, and the convenience of coming to
          you.
        </p>
        <p>
          The name stands for{" "}
          <strong className="text-white">Honesty, Integrity, and Pride</strong>{" "}
          in the work. Paintless dent repair is a craft here — not a volume line.
          If you are not satisfied, you do not owe for that repair. Every job
          carries a lifetime warranty for as long as you own the vehicle.
        </p>
        <p>
          After years in auto body and collision environments, the focus shifted
          to PDR: restoring metal without paint or fillers whenever the panel
          allows it. That approach protects factory finish and often saves time
          compared with traditional body shop cycles — especially after Texas
          hail.
        </p>
      </div>

      <h2 className="mb-6 mt-12 text-2xl font-bold text-white">Ownership</h2>
      <div className="mb-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/15">
            <User className="text-cyan-400" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-white">{OWNER_1_NAME}</h3>
          <p className="mb-3 text-sm text-cyan-400">{OWNER_1_TITLE}</p>
          <p className="text-sm leading-relaxed text-gray-400">
            Grew up in the Houston area. Experience in auto body and collision
            led to a focus on paintless dent repair — the best way to restore a
            vehicle without unnecessary paint. Married, father of three, and
            available directly to clients at {PHONE}.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/20">
            <User className="text-cyan-400" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-white">{OWNER_2_NAME}</h3>
          <p className="mb-3 text-sm text-cyan-400">{OWNER_2_TITLE}</p>
          <p className="text-sm leading-relaxed text-gray-400">
            Co-owner working alongside the team to deliver quality paintless
            dent repair across the greater Houston area.
            {OWNER_2_PHONE && OWNER_2_PHONE_TEL ? (
              <>
                {" "}
                Reach Derrick at{" "}
                <a
                  href={`tel:${OWNER_2_PHONE_TEL}`}
                  className="text-cyan-400 hover:underline"
                >
                  {OWNER_2_PHONE}
                </a>
                .
              </>
            ) : null}
          </p>
        </div>
      </div>

      <div className="mb-10 space-y-4 leading-relaxed text-gray-300">
        <h2 className="text-2xl font-bold text-white">How we work</h2>
        <p>
          Customers send photos first. We return a clear estimate, you accept
          and authorize the work online, then choose a time. We meet you —
          home, office, or another agreed location — and complete qualifying
          repairs on-site.
        </p>
        <p>
          For Jason, PDR is a passion. Ask a technical question and you will get
          a thorough answer. Love of the craft is what turns a job into work
          worth standing behind.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/book"
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3.5 font-semibold text-black transition hover:bg-cyan-400"
        >
          <Camera size={18} />
          Start with Photos
        </Link>
        <a
          href={`tel:${PHONE_TEL}`}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-cyan-500 px-6 py-3.5 font-semibold text-cyan-400 transition hover:bg-cyan-500/10"
        >
          <Phone size={18} />
          {PHONE}
        </a>
      </div>
    </div>
  );
}
