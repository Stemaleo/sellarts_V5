"use server";

import { fetchHelper } from "@/lib/fetchHelper";
import { AdminAnalyticsDTO, ApiResponse, TransactionOverview } from "@/lib/type";

export const getAnalyticsForAdminDashboard = async () => {
  const res = await fetchHelper(process.env.API_URL + `/analytics/admin`, {
    method: "GET",
  });

  const data: ApiResponse<AdminAnalyticsDTO> = await res.json();

  return data;
};

export const getAnalyticsForArtistAndGallery = async () => {
  const res = await fetchHelper(process.env.API_URL + `/analytics/artist`, {
    method: "GET",
  });

  const data: ApiResponse<AdminAnalyticsDTO> = await res.json();

  return data;
};
