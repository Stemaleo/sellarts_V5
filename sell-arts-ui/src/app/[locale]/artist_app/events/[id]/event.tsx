"use client";

import Image from "next/image";
import { CalendarIcon, MapPinIcon, UserIcon, PlusCircle, Search, MinusCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getAEventForOwner } from "@/actions/events";
import moment from "moment";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getMyArtWorks, getMyArtWorksWithoutPagination } from "@/actions/artwork";
import { fetchEventArtworks } from "@/actions/events";
import Form from "next/form";
import { Badge } from "@/components/ui/badge";
import ArtCard from "@/components/ArtCard";
import { getAllPaintingTypes } from "@/actions/paintingType";
import ArtCardManage from "@/components/ArtCardManage";
import CustomPagination from "@/components/ui/custom-pagination";
import { GET_ARTWORK_BY_ID_EVENT } from "@/actions/queries/artwork/querieArtwork";
import axios from "axios";
import { FEATURE_ADD_ARTWORK_TO_EVENT, FEATURE_REMOVE_ARTWORK_FROM_EVENT } from "@/actions/mutation/artwork/mutationsArtwork";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
  // Function to get artworks associated with this event
  async function getEventArtworks(eventId: string, artworks: any) {
    const eventArtworks = [];
    const eventNotArtworks = [];
    // console.log(artworks, "artworks");
    console.log(eventId, "eventId");
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_DJ_API_URL;
      if (!apiUrl) {
        throw new Error("API URL is not defined");
      }
      
      // Check each artwork individually to see if it belongs to the event
      for (const artwork of artworks) {
        console.log(artwork, "artwork");
        try {
          const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "" , {
            query: GET_ARTWORK_BY_ID_EVENT,
            variables: { 
              id: artwork.id,
              event_Id: eventId.toString()
            }
          });
          
          
          const result = response.data;
          if (result.data?.artworks?.edges?.[0]?.node?.eventartworkSet?.length > 0) {
            eventArtworks.push(artwork);
            // console.log(result, "result");
            // console.log(eventArtworks, "eventArtworks");
          }
          else{
            eventNotArtworks.push(artwork);
          }

        } catch (artworkError) {
          console.warn(`Error checking artwork ${artwork.id}:`, artworkError);
          continue;
        }
      }
      
      return [eventArtworks, eventNotArtworks];
    } catch (error) {
      console.error("Error in getEventArtworks:", error);
      return [[], []];
    }
  }

  const handleAddArtwork = async (eventId: string, artworkIds: string[]) => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "" , {
        query: FEATURE_ADD_ARTWORK_TO_EVENT,
        variables: {
          event: eventId,  
          artworks: artworkIds
        }
      });
      
      return response.data;
    } catch (error) {
      console.error("Error in handleAddArtwork:", error);
      return null;
    }
  };

  const handleRemoveArtwork = async (eventId: string, artworkIds: string[]) => {
    try {           
      const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "" , {
        query: FEATURE_REMOVE_ARTWORK_FROM_EVENT,
        variables: {
          event: eventId,
          artworks: artworkIds
        }   
      });
      
      return response.data;
    } catch (error) {
      console.error("Error in handleRemoveArtwork:", error);
      return null;
    }
  };
  
export default function 
EventDetails({ params }: any) {
  const [event, setEvent] = useState<any>(params.id);
  const eventId = params.id;
  const [loading, setLoading] = useState(true);
  const [artworks, setArtworks] = useState<any[]>([]);
  const [eventArtworks, setEventArtworks] = useState<any[]>([]);
  const [paintingTypes, setPaintingTypes] = useState<any[]>([]);
  const [selectedArtworksToAdd, setSelectedArtworksToAdd] = useState<string[]>([]);
  const [selectedArtworksToRemove, setSelectedArtworksToRemove] = useState<string[]>([]);
  const [addingArtworks, setAddingArtworks] = useState(false);
  const [removingArtworks, setRemovingArtworks] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [eventNotArtworks, setEventNotArtworks] = useState<any[]>([]);
  const t = useTranslations();

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch event details
      console.log(params.id, "params.id")
      // const eventRes = await fetchEventArtworks(params.id);
      const eventRes = await getAEventForOwner(params.id);
      console.log(eventRes, "eventRes")
      if (eventRes.success) {
        setEvent(eventRes.data);
      }

      // Fetch artworks
      // const artworksRes = await getMyArtWorks(, "", "");
      const artworksRes = await getMyArtWorksWithoutPagination();
      if (artworksRes.success) {
        setArtworks(artworksRes.data.content);
      }

      // Fetch event artworks
      const [eventArtworksRes, eventNotArtworksRes] = await getEventArtworks(params.id, artworksRes.data.content);
      setEventArtworks(eventArtworksRes);
      setEventNotArtworks(eventNotArtworksRes);

      // Fetch painting typesAfricahouse123Africa
      const paintingTypesRes = await getAllPaintingTypes();
      if (paintingTypesRes.success) {
        setPaintingTypes(paintingTypesRes.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load event data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const handleAddArtworkSelection = (artworkId: string) => {
    setSelectedArtworksToAdd(prev => {
      if (prev.includes(artworkId)) {
        return prev.filter(id => id !== artworkId);
      } else {
        return [...prev, artworkId];
      }
    });
  };

  const handleRemoveArtworkSelection = (artworkId: string) => {
    setSelectedArtworksToRemove(prev => {
      if (prev.includes(artworkId)) {
        return prev.filter(id => id !== artworkId);
      } else {
        return [...prev, artworkId];
      }
    });
  };

  const handleAddArtworkSubmit = async (eventId: string, artworkIds: string[]) => {
    if (artworkIds.length === 0) {
      toast.warning("Please select at least one artwork to add.");
      return;
    }

    try {
      setAddingArtworks(true);
      const result = await handleAddArtwork(eventId, artworkIds);
      
      if (result && !result.errors) {
        toast.success(`Successfully added ${artworkIds.length} artwork(s) to the event.`);
      ;
        
        // Reset selection and refresh data
        setSelectedArtworksToAdd([]);
        setAddDialogOpen(false);
        await fetchData();
      } else {
        toast.error("Failed to add artworks to the event.");
      }
    } catch (error) {
      console.error("Error adding artworks:", error);
      toast.error("An unexpected error occurred while adding artworks.");
    } finally {
      setAddingArtworks(false);
    }
  };

  const handleRemoveArtworkSubmit = async (eventId: string, artworkIds: string[]) => {
    if (artworkIds.length === 0) {
      toast.warning("Please select at least one artwork to remove.");
      return;
    }

    try {
      setRemovingArtworks(true);
      const result = await handleRemoveArtwork(eventId, artworkIds);
      
      if (result && !result.errors) {
        toast.success(`Successfully removed ${artworkIds.length} artwork(s) from the event.`);
        
        // Reset selection and refresh data
        setSelectedArtworksToRemove([]);
        setRemoveDialogOpen(false);
        await fetchData();
      } else {
        toast.error("Failed to remove artworks from the event.");
      }
    } catch (error) {
      console.error("Error removing artworks:", error);
      toast.error("An unexpected error occurred while removing artworks.");
    } finally {
      setRemovingArtworks(false);
    }
  };

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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{event.title}</h1>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {event.mediaUrls.map((image: string, index: number) => (
          <div key={index} className="relative h-64 rounded-lg overflow-hidden">
            <Image src={image} alt={`${event.title} - Image ${index + 1}`} layout="fill" objectFit="cover" />
          </div>
        ))}
      </div>
      ArtworkEventCard
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
      
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{"Event Artworks"}</CardTitle>
        <div className="flex justify-end gap-2">
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                {"add-artwork"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>{"add-artwork-to-event"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-2">
                  {eventNotArtworks.map((artwork: any) => {
                    const isSelected = selectedArtworksToAdd.includes(artwork.id.toString());
                    return (
                      <div 
                        key={artwork.id} 
                        className={`border rounded-lg p-3 relative ${isSelected ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => handleAddArtworkSelection(artwork.id.toString())}
                      >
                        <Checkbox 
                          id={`artwork-${artwork.id}`} 
                          className="absolute top-2 right-2 z-10"
                          checked={isSelected}
                          onCheckedChange={() => handleAddArtworkSelection(artwork.id.toString())}
                        />
                        <div className="relative h-40 mb-2">
                          <Image 
                            src={artwork.mediaUrls[0] || '/placeholder-art.jpg'} 
                            alt={artwork.title} 
                            layout="fill" 
                            objectFit="cover" 
                            className="rounded-md"
                          />
                        </div>
                        <h3 className="font-medium truncate">{artwork.title}</h3>
                        <p className="text-sm text-gray-500 truncate">{artwork.description}</p>
                      </div>
                    );
                  })}
                </div>
                <input 
                  type="hidden" 
                  id="selectedArtworks" 
                  name="selectedArtworks" 
                  value={JSON.stringify(selectedArtworksToAdd)} 
                />
                <div className="flex justify-end">
                  <Button 
                    type="submit"
                    data-event-id={params.id}
                    data-action="add-artworks"
                    onClick={() => handleAddArtworkSubmit(params.id, selectedArtworksToAdd)}
                    disabled={addingArtworks}
                  >
                    {addingArtworks ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {"adding..."}
                      </>
                    ) : (
                      <>{"add-selected"} ({selectedArtworksToAdd.length})</>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 text-red-500 border-red-500 hover:bg-red-50"
              >
                <MinusCircle className="h-4 w-4" />
                {"remove-artworks"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>{"remove-artwork-from-event"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-2">
                  {Array.isArray(eventArtworks) && eventArtworks.length > 0 ? eventArtworks.map((artwork: any) => {
                    const isSelected = selectedArtworksToRemove.includes(artwork.id.toString());
                    return (
                      <div 
                        key={artwork.id} 
                        className={`border rounded-lg p-3 relative ${isSelected ? 'ring-2 ring-destructive' : ''}`}
                        onClick={() => handleRemoveArtworkSelection(artwork.id.toString())}
                      >
                        <Checkbox 
                          id={`remove-artwork-${artwork.id}`} 
                          className="absolute top-2 right-2 z-10"
                          checked={isSelected}
                          onCheckedChange={() => handleRemoveArtworkSelection(artwork.id.toString())}
                        />
                        <div className="relative h-40 mb-2">
                          <Image 
                            src={artwork.mediaUrls[0] || '/placeholder-art.jpg'} 
                            alt={artwork.title} 
                            layout="fill" 
                            objectFit="cover" 
                            className="rounded-md"
                          />
                        </div>
                        <h3 className="font-medium truncate">{artwork.title}</h3>
                        <p className="text-sm text-gray-500 truncate">{artwork.description}</p>
                      </div>
                    );
                  }) : <p>{"no-artworks-to-remove"}</p>}
                </div>
                <input 
                  type="hidden" 
                  id="selectedArtworksToRemove" 
                  name="selectedArtworksToRemove" 
                  value={JSON.stringify(selectedArtworksToRemove)} 
                />
                <div className="flex justify-end">
                  <Button 
                    variant="destructive"
                    data-event-id={params.id}
                    data-action="remove-artworks"
                    onClick={() => handleRemoveArtworkSubmit(params.id, selectedArtworksToRemove)}
                    disabled={removingArtworks}
                  >
                    {removingArtworks ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {"removing..."}
                      </>
                    ) : (
                      <>{"remove-selected"} ({selectedArtworksToRemove.length})</>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* <ArtFilter paintingTypes={res2.data} /> */}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(eventArtworks) ? eventArtworks.map((artwork: any) => (
            <ArtCardManage key={artwork.id} artwork={artwork} />
          )) : null}
        </div>
        
        {(!Array.isArray(eventArtworks) || eventArtworks.length === 0) && (
          <div className="text-center text-gray-500 mt-8">
            No artworks found
          </div>
        )}

        {artworks.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            {t("artistsPage.no-artwork-found")}.
          </p>
        )}

        {/* Pagination placeholder */}
        {/* <CustomPagination page={res.data} /> */}
      </CardContent>
    </Card>

      {/* Participants */}
      <Card>
        <CardHeader>
          <CardTitle>{t("participants")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {event.participants?.map((participant: any) => (
              <div key={participant.id} className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={participant.profileUrl} alt={participant.name} />
                  <AvatarFallback>
                    {participant.name
                      .split(" ")
                      .map((n: string) => n[0])
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




// export default async function UserArtworkGallery({ searchParams }: any) {
//   const search = await searchParams;
//   const res = await getMyArtWorks(search["page"] || 0, search["title"] || "", search["paintingType"] || "");
//   const res2 = await getAllPaintingTypes();
//   const t = await getTranslations();

//   if (!res.success || !res2.success) {
//     return <div>Unable to load</div>;
//   }
//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-8">{t("my-art-works")}</h1>
//       <ArtFilter paintingTypes={res2.data} />
     
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

//           {res.data.content.map((artwork) => (
//               <ArtCardManage key={artwork.id} artwork={artwork}></ArtCardManage>
//           ))}
//         </div>


//       {res.data.content.length === 0 && <p className="text-center text-gray-500 mt-8">{t("artistsPage.no-artwork-found")}.</p>}

//       {/* Pagination placeholder */}
//       <CustomPagination page={res.data} />
//     </div>
//   );
// }
