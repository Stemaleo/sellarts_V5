"use server";

import { PageableResponse } from "@/lib/api";
import { fetchHelper } from "@/lib/fetchHelper";
import { Address, ApiResponse, ArtistProfile, CartItem, Notification, Order, OrderItem, OrderOverview, User } from "@/lib/type";

export const getAllNotification = async () => {
  const res = await fetchHelper(process.env.API_URL + "/notifications", {
    method: "GET",
  });

  const data: ApiResponse<Notification[]> = await res.json();

  return data;
};

export const markAsReadNotifications = async () => {
  const res: Response = await fetchHelper(process.env.API_URL + "/notifications/read", {
    method: "PATCH",
  });

  const data: ApiResponse<Order> = await res.json();

  return data;
};
