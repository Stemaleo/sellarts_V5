import { getAllEvents } from "@/actions/events";
import CustomPagination from "@/components/ui/custom-pagination";
import WebEventCard from "./EventCard";
import { getTranslations } from "next-intl/server";

const Events = async ({ searchParams }: any) => {
  const search = await searchParams;
  const res = await getAllEvents(search["page"] || 0);
  const t = await getTranslations();
  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-3xl font-bold">{t("nav.events")}</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-4">
        {res.data.content.map((event) => {
          return <WebEventCard key={event.id} event={event} />;
        })}
      </div>
      <CustomPagination page={res.data} />
    </div>
  );
};

export default Events;
