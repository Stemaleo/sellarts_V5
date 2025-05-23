"use server";

import { PageableResponse } from "@/lib/api";
import { fetchHelper } from "@/lib/fetchHelper";
import { ApiResponse, ArtWork, Event } from "@/lib/type";
import { GET_ARTWORK_BY_ID_EVENT, GET_EVENT_ARTWORK_BY_ID } from "./queries/artwork/querieArtwork";
import axios from "axios";
export const createEvent = async (event: Partial<Event>, images: File[]) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(event));

  images.forEach((img) => {
    formData.append("images", img);
  });

  const res = await fetchHelper(process.env.API_URL + "/events", {
    method: "post",
    body: formData,
    headers: {},
  });

  const data: ApiResponse<ArtWork> = await res.json();

  return data;
};

export const getMyEvents = async (page: number) => {
  const res = await fetchHelper(process.env.API_URL + `/events/owners?page=${page}`, {
    method: "GET",
  });

  const data: ApiResponse<PageableResponse<Event>> = await res.json();

  return data;
};

export const deleteEvent = async (eventId: number) => {
  const res = await fetchHelper(process.env.API_URL + `/events/${eventId}`, {
    method: "DELETE",
  });

  const data: ApiResponse<string> = await res.json();

  return data;
};

export const getAllEvents = async (page: number) => {
  const res = await fetchHelper(process.env.API_URL + `/events?page=${page}`, {
    method: "GET",
  });

  const data: ApiResponse<PageableResponse<Event>> = await res.json();

  return data;
};

export const registerEvent = async (eventId: number) => {
  const res = await fetchHelper(process.env.API_URL + `/events/${eventId}/register`, {
    method: "POST",
  });

  const data: ApiResponse<string> = await res.json();

  return data;
};

export const getAEventForOwner = async (eventId: number) => {
  const res = await fetchHelper(process.env.API_URL + `/events/owners/${eventId}`, {
    method: "GET",
  });

  const data: ApiResponse<Event> = await res.json();

  return data;
};


export const getAllEventOfAGallery = async (galleryId: number) => {
  const res = await fetchHelper(process.env.API_URL + `/events/owners/${galleryId}/gallery`, {
    method: "GET",
  });

  const data: ApiResponse<Event[]> = await res.json();

  return data;
};


export const fetchEventArtworks = async (eventId: number) => {
  const res = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
    data: {
      query: GET_EVENT_ARTWORK_BY_ID,
      variables: {
        event_Id: eventId,
      },
    }
  });
  console.log(res, "res")
  const data = res.data;
  console.log(data, "data")
  return data;
};
