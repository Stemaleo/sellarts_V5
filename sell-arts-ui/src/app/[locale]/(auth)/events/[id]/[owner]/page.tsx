import { getAEventForOwner } from "@/actions/events";
import { getMyArtWorks } from "@/actions/artwork";
import { getAllPaintingTypes } from "@/actions/paintingType";
import { getTranslations } from "next-intl/server";
import PresentationDetails from "./presentation";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/NavBar";
export default async function PresentationPage({ params }: any) {
  // Await params before accessing its properties
  const eventId = params.id;
  const owner = params.owner;
//   const res = await getAEventForOwner(eventId);
  const t = await getTranslations();
//   const res3 = await getMyArtWorks(0, "", "");
//   const res2 = await getAllPaintingTypes();

//   if (!res.success) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div>Unable to load event data.</div>
//       </div>
//     );
//   }

//   const event = res.data;
  
  return (

    <div>
      <Navbar />
      <PresentationDetails params={{ id: eventId, owner: owner }} />
    </div>
    // <div>
    //   <h1>Events</h1>
    //   <p>Event ID: {eventId}</p>
    // </div>
  );
}
