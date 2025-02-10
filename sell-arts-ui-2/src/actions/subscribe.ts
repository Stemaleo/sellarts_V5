"use server";

import { fetchHelper } from "@/lib/fetchHelper";
import { ApiResponse, ArtWorkDTO, Bid, FavStats } from "@/lib/type";

export const subscribeArtist = async (artistId: number) => {
  const res: Response = await fetchHelper(process.env.API_URL + "/subscribe/" + artistId, {
    method: "POST",
  });

  const data: ApiResponse<String> = await res.json();

  return data;
};
