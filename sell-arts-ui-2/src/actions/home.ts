"use server";

import { fetchHelper } from "@/lib/fetchHelper";
import { ApiResponse, ArtistProfile, ArtistProfileDetails, ArtWorkDTO, FeaturedArtist } from "@/lib/type";

export const getAllRandomArtworks = async () => {
  const res = await fetchHelper(process.env.API_URL + `/home/random/artworks`, {
    method: "GET",
    cache: "force-cache",
    next: {
      revalidate: 600,
    },
  });

  const data: ApiResponse<ArtWorkDTO[]> = await res.json();

  return data;
};

export const getRandomArtists = async () => {
  const res = await fetchHelper(process.env.API_URL + `/home/random/artists`, {
    method: "GET",
    cache: "force-cache",
    next: {
      revalidate: 600,
    },
  });

  const data: ApiResponse<FeaturedArtist[]> = await res.json();

  return data;
};

export const getARandomArtists = async () => {
  const res = await fetchHelper(process.env.API_URL + `/home/random/artist`, {
    method: "GET",
    // cache: "force-cache",
    // next: {
    //   revalidate: 600,
    // },
  });

  const data: ApiResponse<ArtistProfileDetails> = await res.json();

  return data;
};

export const getARandomGallery = async () => {
  const res = await fetchHelper(process.env.API_URL + `/home/random/gallery`, {
    method: "GET",
    // cache: "force-cache",
    // next: {
    //   revalidate: 600,
    // },
  });

  const data: ApiResponse<FeaturedArtist[]> = await res.json();

  return data;
};
