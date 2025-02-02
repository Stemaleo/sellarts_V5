"use server";

import { fetchHelper } from "@/lib/fetchHelper";
import { ApiResponse, MaterialType } from "@/lib/type";

export const getAllMaterialTypes = async () => {
  const res = await fetchHelper(process.env.API_URL + `/materialTypes`, {
    method: "GET",
  });

  const data: ApiResponse<MaterialType[]> = await res.json();

  return data;
};

export const createMaterialType = async (name: string) => {
  const res = await fetchHelper(process.env.API_URL + `/materialTypes`, {
    method: "POST",
    body: JSON.stringify({
      name,
    }),
  });

  const data: ApiResponse<MaterialType[]> = await res.json();

  return data;
};

export const deleteMaterialType = async (id: number) => {
  const res = await fetchHelper(process.env.API_URL + `/materialTypes/${id}`, {
    method: "DELETE",
  });

  const data: ApiResponse<MaterialType[]> = await res.json();

  return data;
};
