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
import { EVENT_REGISTRATION } from "@/actions/queries/artwork/querieArtwork";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";


const WebEventCard = ({ event }: { event: Event }) => {
  const { loading, execute } = useActions();
  const router = useRouter();
  const t = useTranslations();
  const { data: session } = useSession();
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true);
  const [ownerId, setOwnerId] = useState<string | null>(null);
console.log(event, "event")

  useEffect(() => {
    const checkUserRegistration = async () => {
      if (!session?.user?.id) {
        setCheckingRegistration(false);
        return;
      }

      try {
        const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "" , {
          query: EVENT_REGISTRATION,
          variables: {
            user_Id: session.user.id,
            event_Id: event.id.toString()
          }
        });

        const result = response.data;
        setIsRegistered(result.data?.eventRegistration?.edges?.length > 0);
        // Check if the user is the owner of the event
        // const isOwner = result.data?.eventRegistration?.edges?.[0]?.node?.event?.owner?.id === session.user.id;
        
        // Get the owner ID from the event registration data
        setOwnerId(result.data?.eventRegistration?.edges?.[0]?.node?.event?.owner?.artistProfile?.id);
        console.log("Event owner ID:", ownerId);
      } catch (error) {
        console.error("Error checking event registration:", error);
      } finally {
        setCheckingRegistration(false);
      }
    };

    checkUserRegistration();
  }, [session, event.id]);

  const handleDelete = () => {
    execute(deleteEvent, event.id).then((res) => {
      if (res?.success) {
        router.refresh();
        toast.warning("Deleted");
      }
    });
  };

  const handleOpenEvent = () => {
    router.push(`/events/${event.id}/${ownerId}`);
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
      <CardFooter className="flex justify-between">
        {isRegistered ? (
          <Button onClick={handleOpenEvent} className="w-full">
            {t("common.open")}
          </Button>
        ) : (
          <RegisterEventButton event={event} />
        )}
      </CardFooter>
    </Card>
  );
};

export default WebEventCard;
