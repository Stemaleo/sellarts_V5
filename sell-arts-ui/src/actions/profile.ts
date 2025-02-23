"use server";

import { fetchHelper } from "@/lib/fetchHelper";
import { ApiResponse, ArtistProfile, User } from "@/lib/type";

export const registerArtistProfile = async (formData: { bio: string; location: string; portfolioUrl: string }) => {
  const res = await fetchHelper(process.env.API_URL + "/artists", {
    method: "post",
    body: JSON.stringify({
      ...formData,
    }),
  });

  const data: ApiResponse<User> = await res.json();

  return data;
};

export const updateArtistProfile = async (formData: { bio: string; location: string; portfolioUrl: string }) => {
  const res = await fetchHelper(process.env.API_URL + "/artists", {
    method: "put",
    body: JSON.stringify({
      ...formData,
    }),
  });

  const data: ApiResponse<ArtistProfile> = await res.json();

  return data;
};
export const getArtistProfile = async () => {
  const res = await fetchHelper(process.env.API_URL + "/artists/me", {
    method: "GET",
  });

  const data: ApiResponse<ArtistProfile> = await res.json();

  return data;
};

export const updateProfileImage = async (file: File) => {
  const fromData = new FormData();
  fromData.append("image", file);
  const res = await fetchHelper(process.env.API_URL + "/users/me/profile-image", {
    method: "post",
    body: fromData,
    headers: {},
  });

  const data: ApiResponse<string> = await res.json();

  return data;
};

export const updateProfileInfo = async (user: Partial<User>) => {
  const res = await fetchHelper(process.env.API_URL + "/users/me", {
    method: "put",
    body: JSON.stringify(user),
  });
  const data: ApiResponse<User> = await res.json();

  return data;
};
