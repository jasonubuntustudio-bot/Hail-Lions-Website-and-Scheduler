import AreaPage from "@/components/AreaPage";
import { getArea } from "@/lib/area-content";
import { notFound } from "next/navigation";

const area = getArea("sugar-land");

export const metadata = area
  ? {
      title: area.title,
      description: area.description,
      alternates: { canonical: "/areas/sugar-land" },
    }
  : { title: "Service area" };

export default function Page() {
  if (!area) notFound();
  return <AreaPage area={area} />;
}
