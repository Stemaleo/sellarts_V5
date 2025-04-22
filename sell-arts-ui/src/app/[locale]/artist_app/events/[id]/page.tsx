import { getAEventForOwner } from "@/actions/events";
import { getMyArtWorks } from "@/actions/artwork";
import { getAllPaintingTypes } from "@/actions/paintingType";
import { getTranslations } from "next-intl/server";
import EventDetails from "./event";

export default async function EventPage({ params }: any) {
  const para = await params;
  const res = await getAEventForOwner(para.id);
  const t = await getTranslations();
  const res3 = await getMyArtWorks(0, "", "");
  const res2 = await getAllPaintingTypes();

  // if (!res.success) {
  //   return <div>Unable to load</div>;
  // }

  const event = res.data;
  
  return (
    <EventDetails params={{ id: para.id }} />
  );
}
