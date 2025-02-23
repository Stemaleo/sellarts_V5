"use server";

import { PageableResponse } from "@/lib/api";
import { fetchHelper } from "@/lib/fetchHelper";
import { ApiResponse, ArtistProfile, ArtistProfileDetails, ArtistProfileOverview, User } from "@/lib/type";

export const getAllArtistProfiles = async (page: number, title: string, type: string = "ARTIST", size: number = 10) => {
  const res = await fetchHelper(process.env.API_URL + `/artists?type=${type}&size=${size}&page=${page}&name=${title}`, {
    method: "GET",
  });

  const data: ApiResponse<PageableResponse<ArtistProfile>> = await res.json();

  return data;
};

export const getArtistProfileWithInfo = async (artistId: string) => {
  const res: Response = await fetchHelper(process.env.API_URL + "/artists/" + artistId, {
    method: "GET",
  });

  const data: ApiResponse<ArtistProfileDetails> = await res.json();

  return data;
};

export const getArtistProfileWithInfoADMIN = async (artistId: string) => {
  const res: Response = await fetchHelper(process.env.API_URL + "/artists/" + artistId + "/admin", {
    method: "GET",
  });

  const data: ApiResponse<ArtistProfileDetails> = await res.json();

  return data;
};

export const updateCoverImage = async (file: File) => {
  const fromData = new FormData();
  fromData.append("image", file);
  const res = await fetchHelper(process.env.API_URL + "/artists/me/cover-image", {
    method: "post",
    body: fromData,
    headers: {},
  });

  const data: ApiResponse<string> = await res.json();

  return data;
};

export const getMyArtistProfileOverView = async () => {
  const res: Response = await fetchHelper(process.env.API_URL + "/artists/me/overview", {
    method: "GET",
  });

  const data: ApiResponse<ArtistProfileOverview> = await res.json();

  return data;
};
export const updateArtistVerification = async (artistId: number, status: string) => {
  const res: Response = await fetchHelper(process.env.API_URL + `/artists/${artistId}/admin/verify?verification=${status}`, {
    method: "PUT",
  });

  const data: ApiResponse<string> = await res.json();

  return data;
};
