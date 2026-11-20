import AreaTopicPage from "@/components/AreaTopicPage";
import { getArea } from "@/lib/area-content";
import { getTopic } from "@/lib/area-topics";
import { notFound } from "next/navigation";

const area = getArea("conroe");
const topic = getTopic("dent-repair");

export const metadata = area && topic
  ? {
      title: topic.title(area.name),
      description: topic.description(area.name),
      alternates: { canonical: "/areas/conroe/dent-repair" },
    }
  : { title: "Service area" };

export default function Page() {
  if (!area || !topic) notFound();
  return <AreaTopicPage area={area} topic={topic} />;
}
