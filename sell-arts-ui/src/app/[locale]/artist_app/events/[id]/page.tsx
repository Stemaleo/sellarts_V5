import Image from "next/image";
import { CalendarIcon, MapPinIcon, UserIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getAEventForOwner } from "@/actions/events";
import moment from "moment";
import { getTranslations } from "next-intl/server";

interface Participant {
  id: number;
  name: string;
  avatar: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  images: string[];
  registeredCount: number;
  participants: Participant[];
}

export default async function EventDetails({ params }: any) {
  const para = await params;
  const res = await getAEventForOwner(para.id);
  const t = await getTranslations();

  if (!res.success) {
    return <div>Unable to load</div>;
  }

  const event = res.data;
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{event.title}</h1>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {event.mediaUrls.map((image, index) => (
          <div key={index} className="relative h-64 rounded-lg overflow-hidden">
            <Image src={image} alt={`${event.title} - Image ${index + 1}`} layout="fill" objectFit="cover" />
          </div>
        ))}
      </div>

      {/* Event Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("event-details")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{event.description}</p>
          <div className="flex flex-col sm:flex-row justify-between text-sm text-muted-foreground">
            <div className="flex items-center mb-2 sm:mb-0">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {moment(event.endDate).format("D MMM Y")}
            </div>
            <div className="flex items-center mb-2 sm:mb-0">
              <MapPinIcon className="mr-2 h-4 w-4" />
              {event.location}
            </div>
            <div className="flex items-center">
              <UserIcon className="mr-2 h-4 w-4" />
              {event.noOfRegistrations} registered
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Participants */}
      <Card>
        <CardHeader>
          <CardTitle>{t("participants")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {event.participants?.map((participant) => (
              <div key={participant.id} className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={participant.profileUrl} alt={participant.name} />
                  <AvatarFallback>
                    {participant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>{participant.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
