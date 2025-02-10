"use server";

import { PageableResponse } from "@/lib/api";
import { fetchHelper } from "@/lib/fetchHelper";
import { ApiResponse, User, UserInfoDTO } from "@/lib/type";

export const register = async (formData: { name: string; email: string; password: string; confirmPassword: string; type: String }) => {
  const res = await fetchHelper(process.env.API_URL + "/auth/register", {
    method: "post",

    body: JSON.stringify({ ...formData }),
  });

  const data: ApiResponse<User> = await res.json();

  return data;
};

export const getCurrentUserInfo = async () => {
  const res = await fetchHelper(process.env.API_URL + "/users/me", {
    method: "get",
  });

  const data: ApiResponse<User> = await res.json();

  return data;
};

export const getAllUsers = async (page: number, type: string) => {
  const res = await fetchHelper(process.env.API_URL + `/users?page=${page}&type=${type}`, {
    method: "get",
  });

  const data: ApiResponse<PageableResponse<UserInfoDTO>> = await res.json();

  return data;
};

export const resetPassword = async (email: string) => {
  const res = await fetchHelper(process.env.API_URL + `/auth/reset`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });

  const data: ApiResponse<string> = await res.json();

  return data;
};

export const changePassword = async (password: string) => {
  const res = await fetchHelper(process.env.API_URL + `/auth/change-password`, {
    method: "POST",
    body: JSON.stringify({ password }),
  });

  const data: ApiResponse<string> = await res.json();

  return data;
};
