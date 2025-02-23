"use server";

import { fetchHelper } from "@/lib/fetchHelper";
import { ApiResponse, ArtWorkDTO, Bid, FavStats, Promo } from "@/lib/type";

export const createPromo = async (code: string, amount: number) => {
  const isPercentage = false;
  const res: Response = await fetchHelper(process.env.API_URL + "/promo", {
    method: "POST",
    body: JSON.stringify({
      code,
      amount,
      isPercentage,
    }),
  });

  const data: ApiResponse<String> = await res.json();

  return data;
};

export const getMyPromos = async () => {
  const res: Response = await fetchHelper(process.env.API_URL + "/promo", {
    method: "GET",
  });

  const data: ApiResponse<Promo[]> = await res.json();

  return data;
};

export const deletePromo = async (promoId: number) => {
  const res: Response = await fetchHelper(process.env.API_URL + "/promo/" + promoId, {
    method: "DELETE",
  });

  const data: ApiResponse<string> = await res.json();

  return data;
};

export const updatePromo = async (promoId: number, status: string) => {
  const res: Response = await fetchHelper(process.env.API_URL + `/promo/${promoId}?status=${status}`, {
    method: "PATCH",
  });

  const data: ApiResponse<string> = await res.json();

  return data;
};
