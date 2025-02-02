import { getMyEvents } from "@/actions/events";
import CustomPagination from "@/components/ui/custom-pagination";
import EventCard from "./EventCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";

const EventsPage = async ({ searchParams }: any) => {
  const search = await searchParams;
  const res = await getMyEvents(search["page"] || 0);
  const t = await getTranslations();

  return (
    <div>
      <div className="flex justify-between items-center  mb-8">
        <h1 className="text-3xl font-bold">{t("my-events")}</h1>
        <Link href={"/artist_app/events/create"}>
          <Button>Create</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {res.data.content.map((event) => {
          return (
            <Link key={event.id} href={`/artist_app/events/${event.id}`}>
              <EventCard editUrlPrefix="/artist_app/events" event={event} />
            </Link>
          );
        })}
      </div>

      <CustomPagination page={res.data} />
    </div>
  );
};

export default EventsPage;
