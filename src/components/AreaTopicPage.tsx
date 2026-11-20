import Link from "next/link";
import { Camera, Phone, ArrowLeft, Check } from "lucide-react";
import { PHONE, PHONE_TEL, BUSINESS_NAME } from "@/lib/utils";
import type { AreaContent } from "@/lib/area-content";
import type { AreaTopic } from "@/lib/area-topics";
import { AREA_TOPICS } from "@/lib/area-topics";

export default function AreaTopicPage({
  area,
  topic,
}: {
  area: AreaContent;
  topic: AreaTopic;
}) {
  const city = area.name;
  const sections = topic.sections(area);
  const otherTopics = AREA_TOPICS.filter((t) => t.slug !== topic.slug);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Link
        href={`/areas/${area.slug}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-cyan-400 hover:underline"
      >
        <ArrowLeft size={16} />
        {city} service area
      </Link>

      <p className="mb-2 text-sm font-medium uppercase tracking-wide text-cyan-500/80">
        {area.stateLabel} · {topic.label}
      </p>
      <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
        {topic.h1(city)}
      </h1>
      <p className="mb-8 text-lg text-cyan-400">{area.tagline}</p>

      <div className="space-y-8 leading-relaxed text-gray-300">
        {sections.map((sec) => (
          <div key={sec.heading}>
            <h2 className="mb-3 text-2xl font-semibold text-white">
              {sec.heading}
            </h2>
            {sec.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="mb-3">
                {p}
              </p>
            ))}
          </div>
        ))}

        <div>
          <h2 className="mb-3 text-2xl font-semibold text-white">
            How {BUSINESS_NAME} works in {city}
          </h2>
          <ul className="space-y-2">
            {[
              "Send clear photos online for a written estimate",
              "Accept the quote and sign authorization when ready",
              `Choose a time — we come to you in ${city}`,
              "Satisfaction guarantee and lifetime warranty on our paintless work",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="mt-0.5 shrink-0 text-cyan-400" size={18} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-semibold text-white">
            More in {city}
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {otherTopics.map((t) => (
              <Link
                key={t.slug}
                href={`/areas/${area.slug}/${t.slug}`}
                className="rounded-lg border border-gray-800 bg-gray-900/80 px-4 py-3 text-sm text-gray-300 transition hover:border-cyan-500/40 hover:text-cyan-400"
              >
                {t.h1(city)} →
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/book"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 font-bold text-black transition hover:bg-cyan-400"
        >
          <Camera size={20} />
          Start with Photos
        </Link>
        <a
          href={`tel:${PHONE_TEL}`}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-500 px-6 py-3 font-semibold text-cyan-400 transition hover:bg-cyan-500/10"
        >
          <Phone size={18} />
          {PHONE}
        </a>
      </div>
    </div>
  );
}
