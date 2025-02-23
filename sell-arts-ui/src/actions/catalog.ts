"use server";

import { fetchHelper } from "@/lib/fetchHelper";
import { ApiResponse, ArtWorkDTO, Bid, Catalog, FavStats, Promo, StoreCatalog } from "@/lib/type";

export const createCatalog = async (catalog: StoreCatalog) => {
  const res: Response = await fetchHelper(process.env.API_URL + "/catalogues", {
    method: "POST",
    body: JSON.stringify(catalog),
  });

  const data: ApiResponse<String> = await res.json();

  return data;
};

export const getMyCatalogs = async () => {
  const res: Response = await fetchHelper(process.env.API_URL + "/catalogues/me", {
    method: "GET",
  });

  const data: ApiResponse<Catalog[]> = await res.json();

  return data;
};

export const deleteACatalog = async (catalogId: string) => {
  const res: Response = await fetchHelper(process.env.API_URL + `/catalogues/${catalogId}`, {
    method: "DELETE",
  });

  const data: ApiResponse<string> = await res.json();

  return data;
};

export const getACatalog = async (catalogId: string) => {
  const res: Response = await fetchHelper(process.env.API_URL + `/catalogues/${catalogId}`, {
    method: "GET",
  });

  const data: ApiResponse<Catalog> = await res.json();

  return data;
};
