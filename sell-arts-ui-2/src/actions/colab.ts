"use server";

import { PageableResponse } from "@/lib/api";
import { fetchHelper } from "@/lib/fetchHelper";
import { ApiResponse, ArtistProfile, ColabRequest, TransactionOverview, UserInfoDTO } from "@/lib/type";

export const sendColabRequest = async (artistId: string) => {
  const res = await fetchHelper(process.env.API_URL + `/colab/request`, {
    method: "POST",
    body: JSON.stringify({ artistId }),
  });

  const data: ApiResponse<TransactionOverview> = await res.json();

  return data;
};

export const updateColabRequest = async (requestId: string, status: string) => {
  const res = await fetchHelper(process.env.API_URL + `/colab/request/${requestId}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });

  const data: ApiResponse<ColabRequest> = await res.json();

  return data;
};

export const getAllColabRequest = async (page: number) => {
  const res = await fetchHelper(process.env.API_URL + `/colab/request?page=${page}`, {
    method: "GET",
  });

  const data: ApiResponse<PageableResponse<ColabRequest>> = await res.json();

  return data;
};

export const getAllColabArtists = async (page: number) => {
  const res = await fetchHelper(process.env.API_URL + `/colab/artists?page=${page}`, {
    method: "GET",
  });

  const data: ApiResponse<PageableResponse<ColabRequest>> = await res.json();

  return data;
};

export const getAllColabOfAGallery = async (galleryId: number) => {
  const res = await fetchHelper(process.env.API_URL + `/colab/${galleryId}/colab`, {
    method: "GET",
  });

  const data: ApiResponse<ArtistProfile[]> = await res.json();

  return data;
};
