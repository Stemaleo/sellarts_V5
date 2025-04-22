"use client";

import Image from "next/image";
import { CalendarIcon, MapPinIcon, UserIcon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getAEventForOwner } from "@/actions/events";
import moment from "moment";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import ArtCardManage from "@/components/ArtCardManage";
import { Loader2 } from "lucide-react";
import { GET_EVENT_ARTWORK_BY_ID } from "@/actions/queries/artwork/querieArtwork";
import axios from "axios";

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

interface ArtworkData {
  id: string;
  price: number;
  description: string;
  stock: number;
  title: string;
  method: {
    name: string;
  };
}

// Function to get artworks associated with this event
async function getEventArtworks(eventId: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_DJ_API_URL;
    if (!apiUrl) {
      throw new Error("API URL is not defined");
    }
    
    const response = await axios.post(apiUrl, {
      query: GET_EVENT_ARTWORK_BY_ID,
      variables: { 
        event_Id: eventId.toString()
      }
    });
    
    if (response.data.errors) {
      console.error("GraphQL errors:", response.data.errors);
      return [];
    }
    
    const eventArtworks = response.data.data?.eventArtwork?.edges?.map((edge: any) => edge.node.artwork) || [];
    return eventArtworks;
  } catch (error) {
    console.error("Error in getEventArtworks:", error);
    return [];
  }
}

// Custom component for displaying artwork information
const ArtworkCard = ({ artwork }: { artwork: ArtworkData }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg truncate">{artwork.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-2 line-clamp-3">{artwork.description}</p>
        <div className="flex justify-between items-center mt-auto">
          <span className="font-medium">${artwork.price}</span>
          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
            {artwork.method?.name || "Mixed Media"}
          </span>
        </div>
        {artwork.stock > 0 ? (
          <p className="text-sm text-green-600 mt-2">In stock: {artwork.stock}</p>
        ) : (
          <p className="text-sm text-red-600 mt-2">Out of stock</p>
        )}
      </CardContent>
    </Card>
  );
};

export default function EventDetails({ params }: any) {
  const eventId = params.id;
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [eventArtworks, setEventArtworks] = useState<ArtworkData[]>([]);
  const [artworksLoading, setArtworksLoading] = useState(true);
  const t = useTranslations();

  
  const fetchData = async () => {
    try {
      setLoading(true);
      setArtworksLoading(true);
      
      // Fetch event details
      const eventRes = await getAEventForOwner(eventId);
      console.log(eventRes);
      if (eventRes.success) {
        setEvent(eventRes.data);
      }
      // setLoading(false);

      // // Fetch event artworks using the GET_EVENT_ARTWORK_BY_ID query
      const eventArtworksRes = await getEventArtworks(eventId);
      setEventArtworks(eventArtworksRes);
      setArtworksLoading(false);
    } catch (error) {
      // const eventRes = await getAEventForOwner(eventId);
      // console.log(eventRes);
      console.error("Error fetching data:", error);
      // setLoading(false);
      // setArtworksLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading event details...</span>
      </div>
    );
  }

  if (!event) {
    return <div>Unable to load</div>;
  }

  return (

    <div>
      <h1>{"event details"}</h1>
    </div>
    // <div className="container mx-auto p-4">
    //   <h1 className="text-3xl font-bold mb-6">{event.title}</h1>

    //   {/* Image Gallery */}
    //   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    //     {event.mediaUrls.map((image: string, index: number) => (
    //       <div key={index} className="relative h-64 rounded-lg overflow-hidden">
    //         <Image src={image} alt={`${event.title} - Image ${index + 1}`} layout="fill" objectFit="cover" />
    //       </div>
    //     ))}
    //   </div>

    //   {/* Event Details */}
    //   <Card className="mb-6">
    //     <CardHeader>
    //       <CardTitle>{t("event-details")}</CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <p className="text-muted-foreground mb-4">{event.description}</p>
    //       <div className="flex flex-col sm:flex-row justify-between text-sm text-muted-foreground">
    //         <div className="flex items-center mb-2 sm:mb-0">
    //           <CalendarIcon className="mr-2 h-4 w-4" />
    //           {moment(event.endDate).format("D MMM Y")}
    //         </div>
    //         <div className="flex items-center mb-2 sm:mb-0">
    //           <MapPinIcon className="mr-2 h-4 w-4" />
    //           {event.location}
    //         </div>
    //         <div className="flex items-center">
    //           <UserIcon className="mr-2 h-4 w-4" />
    //           {event.noOfRegistrations} registered
    //         </div>
    //       </div>
    //     </CardContent>
    //   </Card>
      
    // <Card className="mb-6">
    //   <CardHeader>
    //     <CardTitle>{"Event Artworks"}</CardTitle>
    //   </CardHeader>
    //   <CardContent>
    //     {artworksLoading ? (
    //       <div className="flex justify-center items-center py-12">
    //         <Loader2 className="h-8 w-8 animate-spin text-primary" />
    //         <span className="ml-2">Loading artworks...</span>
    //       </div>
    //     ) : (
    //       <>
    //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //           {Array.isArray(eventArtworks) && eventArtworks.length > 0 ? (
    //             eventArtworks.map((artwork: ArtworkData) => (
    //               <ArtworkCard key={artwork.id} artwork={artwork} />
    //             ))
    //           ) : null}
    //         </div>
            
    //         {(!Array.isArray(eventArtworks) || eventArtworks.length === 0) && (
    //           <div className="text-center text-gray-500 mt-8">
    //             No artworks found
    //           </div>
    //         )}
    //       </>
    //     )}
    //   </CardContent>
    // </Card>

    //   {/* Participants */}
    //   <Card>
    //     <CardHeader>
    //       <CardTitle>{t("participants")}</CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    //         {event.participants?.map((participant: any) => (
    //           <div key={participant.id} className="flex items-center space-x-4">
    //             <Avatar>
    //               <AvatarImage src={participant.profileUrl} alt={participant.name} />
    //               <AvatarFallback>
    //                 {participant.name
    //                   .split(" ")
    //                   .map((n: string) => n[0])
    //                   .join("")}
    //               </AvatarFallback>
    //             </Avatar>
    //             <div>{participant.name}</div>
    //           </div>
    //         ))}
    //       </div>
    //     </CardContent>
    //   </Card>
    // </div>
  );
}
