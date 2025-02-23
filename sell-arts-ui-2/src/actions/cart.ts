"use server";

import { PageableResponse } from "@/lib/api";
import { fetchHelper } from "@/lib/fetchHelper";
import { Address, ApiResponse, ArtistProfile, CartItem, Order, OrderItem, OrderOverview, User } from "@/lib/type";

export const getAllCart = async () => {
  const res = await fetchHelper(process.env.API_URL + "/cart", {
    method: "GET",
  });

  const data: ApiResponse<CartItem[]> = await res.json();

  return data;
};

export const addToCart = async (artId: string) => {
  const res: Response = await fetchHelper(process.env.API_URL + "/cart", {
    method: "POST",
    body: JSON.stringify({
      artId,
    }),
  });

  const data: ApiResponse<String> = await res.json();

  return data;
};

export const deleteCartItem = async (artId: string) => {
  const res: Response = await fetchHelper(process.env.API_URL + "/cart/" + artId, {
    method: "DELETE",
  });

  const data: ApiResponse<String> = await res.json();

  return data;
};

export const checkOutCart = async () => {
  const res: Response = await fetchHelper(process.env.API_URL + "/checkout", {
    method: "POST",
  });

  const data: ApiResponse<Order> = await res.json();

  return data;
};

export const getAOrder = async (orderId: string) => {
  const res: Response = await fetchHelper(process.env.API_URL + "/orders/" + orderId, {
    method: "GET",
  });

  const data: ApiResponse<Order> = await res.json();

  return data;
};

export const getAOrderForAdmin = async (orderId: string) => {
  const res: Response = await fetchHelper(process.env.API_URL + "/orders/" + orderId + "/admin", {
    method: "GET",
  });

  const data: ApiResponse<Order> = await res.json();

  return data;
};

export const getAllOrders = async () => {
  const res: Response = await fetchHelper(process.env.API_URL + "/orders", {
    method: "GET",
  });

  const data: ApiResponse<Order[]> = await res.json();

  return data;
};

export const getAllOrdersForArtist = async (page: number, range: string) => {
  const res: Response = await fetchHelper(process.env.API_URL + `/orders/artists/orderItems?page=${page}&range=${range}`, {
    method: "GET",
  });

  const data: ApiResponse<OrderOverview> = await res.json();

  return data;
};

export const getAllOrdersForArtistAdmin = async (artistId: number, page: number) => {
  const res: Response = await fetchHelper(process.env.API_URL + `/orders/artists/${artistId}/orderItems?page=${page}`, {
    method: "GET",
  });

  const data: ApiResponse<OrderOverview> = await res.json();

  return data;
};

export const getAllOrdersForAdmin = async (page: number, orderId: string) => {
  const res: Response = await fetchHelper(process.env.API_URL + `/orders/admin?page=${page}&orderId=${orderId}`, {
    method: "GET",
  });

  const data: ApiResponse<PageableResponse<Order>> = await res.json();

  return data;
};

export const updateOrderAddress = async (orderId: string, address: Address) => {
  const res: Response = await fetchHelper(process.env.API_URL + "/checkout/" + orderId + "/address", {
    method: "PUT",
    body: JSON.stringify(address),
  });

  const data: ApiResponse<string> = await res.json();

  return data;
};
