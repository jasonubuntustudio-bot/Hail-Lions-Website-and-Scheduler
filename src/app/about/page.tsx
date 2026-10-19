import Link from "next/link";
import { Phone } from "lucide-react";
import { PHONE, PHONE_TEL } from "@/lib/utils";

export const metadata = {
  title: "About Us",
  description:
    "Meet Jason Huddleston and Hail Lions LLC — Houston's mobile paintless dent repair specialists.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-white mb-6">About Hail Lions</h1>

      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          I am married and the father of three beautiful children. I grew up in
          the Houston area and have strong ties to all the communities in and
          around Houston.
        </p>
        <p>
          Having a passion for auto bodywork, I have been in the auto
          body/collision industry in one form or another since my teens. Having
          a father in the same industry, he instilled a hard work ethic and a
          desire to do a job the best it can be done. He would not settle for
          less than perfection and expected the same from me.
        </p>
        <p>
          For me, Paintless Dent Repair is a passion. If you ask me a question
          about PDR you should come with a chair, because you will get the long
          answer. Having a love for what you do makes it more than an
          occupation.
        </p>
        <p>
          I started Hail Lions with the customer in mind. I want to provide a
          service that is of the highest quality, so PDR was the obvious choice.
          Customer satisfaction is just as high a priority — if you are not
          satisfied, you do not owe anything. Convenience is next, so Hail Lions
          is a completely mobile company that will come to you at a time and
          place of your choosing.
        </p>
        <p>
          I chose the name Hail Lions because I wanted the name to stand for
          Honesty, Integrity, and Pride in the work we do.
        </p>
        <p className="text-white font-medium">
          Jason Huddleston
          <br />
          CEO, Hail Lions LLC
        </p>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Link
          href="/book"
          className="inline-flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 rounded-lg transition"
        >
          Book Service
        </Link>
        <a
          href={`tel:${PHONE_TEL}`}
          className="inline-flex items-center justify-center gap-2 border border-cyan-500 text-cyan-400 font-semibold px-6 py-3 rounded-lg hover:bg-cyan-500/10 transition"
        >
          <Phone size={18} />
          {PHONE}
        </a>
      </div>
    </div>
  );
}
