"use server";

import { fetchHelper } from "@/lib/fetchHelper";
import { ApiResponse, ArtWorkDTO, FavStats } from "@/lib/type";

export const addToFav = async (artworkId: string) => {
  const res: Response = await fetchHelper(process.env.API_URL + "/favourites", {
    method: "POST",
    body: JSON.stringify({
      artworkId,
    }),
  });

  const data: ApiResponse<String> = await res.json();

  return data;
};

export const getFavStats = async () => {
  const res: Response = await fetchHelper(process.env.API_URL + "/favourites/admin", {
    method: "GET",
  });

  const data: ApiResponse<FavStats[]> = await res.json();

  return data;
};

export const getMyFav = async () => {
  const res: Response = await fetchHelper(process.env.API_URL + "/favourites", {
    method: "GET",
  });

  const data: ApiResponse<ArtWorkDTO[]> = await res.json();

  return data;
};
