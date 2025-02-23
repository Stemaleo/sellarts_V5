"use server";

import { fetchHelper } from "@/lib/fetchHelper";
import { ApiResponse, ArtWorkDTO, Bid, FavStats } from "@/lib/type";

export const makeProposal = async (artworkId: string, amount: number) => {
  const res: Response = await fetchHelper(process.env.API_URL + "/bids", {
    method: "POST",
    body: JSON.stringify({
      artworkId,
      amount,
    }),
  });

  const data: ApiResponse<String> = await res.json();

  return data;
};

export const getMyBids = async () => {
  const res: Response = await fetchHelper(process.env.API_URL + "/bids/my", {
    method: "GET",
  });

  const data: ApiResponse<Bid[]> = await res.json();

  return data;
};

export const getArtistBids = async () => {
  const res: Response = await fetchHelper(process.env.API_URL + "/bids/artist", {
    method: "GET",
  });

  const data: ApiResponse<Bid[]> = await res.json();

  return data;
};

export const updateBid = async (bidId: number, status: string) => {
  const res: Response = await fetchHelper(process.env.API_URL + "/bids/" + bidId, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });

  const data: ApiResponse<Bid> = await res.json();

  return data;
};
