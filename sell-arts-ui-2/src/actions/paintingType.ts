"use server";

import { fetchHelper } from "@/lib/fetchHelper";
import { ApiResponse, PaintingType } from "@/lib/type";

export const getAllPaintingTypes = async () => {
  const res = await fetchHelper(process.env.API_URL + `/paintingTypes`, {
    method: "GET",
  });

  const data: ApiResponse<PaintingType[]> = await res.json();

  return data;
};

export const createPaintingType = async (name: string) => {
  const res = await fetchHelper(process.env.API_URL + `/paintingTypes`, {
    method: "POST",
    body: JSON.stringify({
      name,
    }),
  });

  const data: ApiResponse<PaintingType[]> = await res.json();

  return data;
};

export const deletePaintingType = async (id: number) => {
  const res = await fetchHelper(process.env.API_URL + `/paintingTypes/${id}`, {
    method: "DELETE",
  });

  const data: ApiResponse<PaintingType[]> = await res.json();

  return data;
};
