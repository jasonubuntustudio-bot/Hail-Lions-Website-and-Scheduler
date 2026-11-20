import AreaTopicPage from "@/components/AreaTopicPage";
import { getArea } from "@/lib/area-content";
import { getTopic } from "@/lib/area-topics";
import { notFound } from "next/navigation";

const area = getArea("the-woodlands");
const topic = getTopic("auto-hail-damage-repair");

export const metadata = area && topic
  ? {
      title: topic.title(area.name),
      description: topic.description(area.name),
      alternates: { canonical: "/areas/the-woodlands/auto-hail-damage-repair" },
    }
  : { title: "Service area" };

export default function Page() {
  if (!area || !topic) notFound();
  return <AreaTopicPage area={area} topic={topic} />;
}
