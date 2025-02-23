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
import RegisterEventButton from "./RegisterBtn";
import { useTranslations } from "next-intl";

const WebEventCard = ({ event }: { event: Event }) => {
  const { loading, execute } = useActions();
  const router = useRouter();
  const t = useTranslations();
  const handleDelete = () => {
    execute(deleteEvent, event.id).then((res) => {
      if (res?.success) {
        router.refresh();
        toast.warning("Deleted");
      }
    });
  };

  return (
    <Card className=" overflow-hidden">
      <div className="relative h-48">
        <Image src={event.mediaUrls[0]} alt={event.title} layout="fill" objectFit="cover" className="transition-transform duration-300 hover:scale-105" />
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
        <div className="flex justify-between text-sm text-muted-foreground mb-4">
          {event.maxRegistration > 0 && (
            <div className="flex items-center text-sm text-muted-foreground">
              <UserIcon className="mr-2 h-4 w-4" />
              {event.maxRegistration} {t("common.seats")}
            </div>
          )}
          <div className="flex items-center text-sm text-muted-foreground">
            <UserIcon className="mr-2 h-4 w-4" />
            {event.noOfRegistrations} {t("common.registered")}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <RegisterEventButton event={event} />
      </CardFooter>
    </Card>
  );
};

export default WebEventCard;
