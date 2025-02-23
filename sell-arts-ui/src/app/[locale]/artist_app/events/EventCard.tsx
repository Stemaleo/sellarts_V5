"use client";

import { CalendarIcon, MapPinIcon, PencilIcon, TrashIcon, UserIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Event } from "@/lib/type";
import moment from "moment";
import Link from "next/link";
import { useActions } from "@/lib/hooks";
import { deleteEvent } from "@/actions/events";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const EventCard = ({ event, editUrlPrefix }: { event: Event; editUrlPrefix: string }) => {
  const { loading, execute } = useActions();
  const router = useRouter();
  const handleDelete = () => {
    execute(deleteEvent, event.id).then((res) => {
      if (res?.success) {
        router.refresh();
        toast.warning("Deleted");
      }
    });
  };

  return (
    <Card className="max-w-sm overflow-hidden">
      <div className="relative h-48">
        <Image src={event.mediaUrls[0]} alt={event.title} layout="fill" objectFit="cover" className="transition-transform duration-300 hover:scale-105" />
        {/* <Link href={editUrlPrefix + `/${event.id}/edit`} className="absolute top-2 right-2 bg-opacity-50 hover:bg-opacity-100">
          <Button variant="secondary" size="icon">
            <PencilIcon className="h-4 w-4" />
            <span className="sr-only">Edit event</span>
          </Button>
        </Link> */}
        <Button onClick={handleDelete} loading={loading} disabled={loading} variant="secondary" size="icon" className="absolute top-2 right-2 bg-opacity-50 hover:bg-opacity-100">
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription className="line-clamp-2">{event.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {moment(event.endDate).format("D MMM Y")}
          </div>
          <div className="flex items-center">
            <MapPinIcon className="mr-2 h-4 w-4" />
            {event.location}
          </div>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <UserIcon className="mr-2 h-4 w-4" />
          {event.noOfRegistrations} registered
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
