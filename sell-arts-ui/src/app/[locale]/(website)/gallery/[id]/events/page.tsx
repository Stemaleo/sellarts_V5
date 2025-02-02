import { getAllColabOfAGallery } from "@/actions/colab";
import { getAllEventOfAGallery } from "@/actions/events";
import { PageProps } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import WebEventCard from "../../../events/EventCard";

const Collaborators = async ({ params }: PageProps) => {
  const id = await params;
  const res = await getAllEventOfAGallery(id.id);

  if (!res.success) {
    return <div>Unable to load</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mt-12 mb-6">Events</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-4">
        {res.data.map((event) => {
          return <WebEventCard key={event.id} event={event} />;
        })}
      </div>
    </div>
  );
};

export default Collaborators;
