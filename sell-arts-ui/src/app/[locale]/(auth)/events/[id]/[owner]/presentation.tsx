"use client";

import Image from "next/image";
import { CalendarIcon, MapPinIcon, UserIcon, ChevronLeft, ChevronRight } from "lucide-react";
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
import Link from "next/link";
import ArtworkEventCard from "./ArtworkEventCard";

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
  isFeatured: boolean;
  createdAt: string;
  size: string;
  width: number;
  height: number;
  method: {
    id: string;
    name: string;
  };
  style: {
    id: string;
    name: string;
  };
  materialType: {
    id: string;
    name: string;
  };
  mediasSet: Array<{
    publicUrl: string;
    contentSize: number;
    contentType: string;
    key: string;
  }>;
  artist: {
    name: string;
    artistProfile: {
      id: string;
      artistType: string;
      bio: string;
      coverUrl: string;
      location: string;
      portfolioUrl: string;
    };
  };
  owner: {
    id: string;
    name: string;
    artistProfile: {
      id: string;
      location: string;
    };
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


export default function EventDetails({ params }: any) {
  const eventId = params.id;
  const owner = params.owner;
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [eventArtworks, setEventArtworks] = useState<ArtworkData[]>([]);
  const [artworksLoading, setArtworksLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const artworksPerPage = 6;
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
      setLoading(false);

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

  // Calculate pagination
  const indexOfLastArtwork = currentPage * artworksPerPage;
  const indexOfFirstArtwork = indexOfLastArtwork - artworksPerPage;
  const currentArtworks = eventArtworks.slice(indexOfFirstArtwork, indexOfLastArtwork);
  const totalPages = Math.ceil(eventArtworks.length / artworksPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <span className="mt-4 text-lg font-medium text-gray-700">Loading event details...</span>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-red-600">Unable to load event</h2>
          <p className="mt-2 text-gray-600">Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen w-full">
      <div className="w-full mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-primary">{event.title}</h1>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {event.mediaUrls.map((image: string, index: number) => (
            <div 
              key={index} 
              className="relative h-72 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <Image 
                src={image} 
                alt={`${event.title} - Image ${index + 1}`} 
                layout="fill" 
                objectFit="cover" 
                className="transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

        {/* Event Details */}
        <Card className="mb-10 shadow-lg border-none overflow-hidden bg-white rounded-xl">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10">
            <CardTitle className="text-2xl text-primary">{t("event-details")}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">{event.description}</p>
            <div className="flex flex-col sm:flex-row justify-between text-sm p-4 rounded-lg">
              <div className="flex items-center mb-3 sm:mb-0 bg-white p-3 rounded-md shadow-sm">
                <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                <span className="font-medium">{moment(event.endDate).format("D MMM Y")}</span>
              </div>
              <div className="flex items-center mb-3 sm:mb-0 bg-white p-3 rounded-md shadow-sm">
                <MapPinIcon className="mr-2 h-5 w-5 text-red-500" />
                <span className="font-medium">{event.location}</span>
              </div>
              <div className="flex items-center bg-white p-3 rounded-md shadow-sm">
                <UserIcon className="mr-2 h-5 w-5 text-blue-500" />
                <span className="font-medium">{event.noOfRegistrations} registered</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Event Artworks */}
        <Card className="mb-10 shadow-lg border-none overflow-hidden bg-white rounded-xl">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10">
            <CardTitle className="text-2xl text-primary">{"Event Artworks"}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {artworksLoading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <span className="ml-3 text-lg font-medium text-gray-600">Loading artworks...</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.isArray(currentArtworks) && currentArtworks.length > 0 ? (
                    currentArtworks.map((artwork: ArtworkData) => (
                      <div
                        key={artwork.id}
                      >
                        <ArtworkEventCard artwork={artwork} eventId={eventId} owner={owner} />
                      </div>
                    ))
                  ) : null}
                </div>
                
                {(!Array.isArray(eventArtworks) || eventArtworks.length === 0) && (
                  <div className="text-center py-16 border rounded-lg">
                    <div className="text-gray-500 text-lg">No artworks found for this event</div>
                    <p className="mt-2 text-gray-400">Check back later for updates</p>
                  </div>
                )}

                {/* Pagination */}
                {eventArtworks.length > artworksPerPage && (
                  <div className="flex justify-center items-center mt-8 space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={prevPage} 
                      disabled={currentPage === 1}
                      className="flex items-center"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <Button
                          key={i}
                          variant={currentPage === i + 1 ? "default" : "outline"}
                          className={`w-10 h-10 p-0 ${currentPage === i + 1 ? 'bg-primary text-white' : ''}`}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={nextPage} 
                      disabled={currentPage === totalPages}
                      className="flex items-center"
                    >
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Participants */}
        <Card className="shadow-lg border-none overflow-hidden bg-white rounded-xl">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10">
            <CardTitle className="text-2xl text-primary">{t("participants")}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {event.participants?.map((participant: any) => (
                <div 
                  key={participant.id} 
                  className="flex items-center space-x-4 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-200"
                >
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src={participant.profileUrl} alt={participant.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {participant.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{participant.name}</div>
                </div>
              ))}
            </div>
            {(!event.participants || event.participants.length === 0) && (
              <div className="text-center py-12 border rounded-lg">
                <div className="text-gray-500 text-lg">No participants yet</div>
                <p className="mt-2 text-gray-400">Be the first to join this event!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
