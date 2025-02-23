"use server";

import { fetchHelper } from "@/lib/fetchHelper";
import { ApiResponse, TransactionOverview } from "@/lib/type";

export const getAllArtistTransactions = async (page: number) => {
  const res = await fetchHelper(process.env.API_URL + `/transactions/artists?page=${page}`, {
    method: "GET",
  });

  const data: ApiResponse<TransactionOverview> = await res.json();

  return data;
};

export const getArtistTransactionsAdmin = async (artistId: number, page: number) => {
  const res = await fetchHelper(process.env.API_URL + `/transactions/artists/${artistId}?page=${page}`, {
    method: "GET",
  });

  const data: ApiResponse<TransactionOverview> = await res.json();

  return data;
};

export const payArtist = async (artistId: number, amount: number) => {
  const res = await fetchHelper(process.env.API_URL + `/transactions/artists/${artistId}/pay`, {
    method: "POST",
    body: JSON.stringify({ amount }),
  });

  const data: ApiResponse<any> = await res.json();

  return data;
};
