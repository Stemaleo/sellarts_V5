"use server";

import { PageableResponse } from "@/lib/api";
import { fetchHelper } from "@/lib/fetchHelper";
import { ApiResponse, Payment } from "@/lib/type";

export const getAllPayments = async (page: number) => {
  const res = await fetchHelper(process.env.API_URL + `/payments?page=${page}`, {
    method: "GET",
  });

  const data: ApiResponse<PageableResponse<Payment>> = await res.json();

  return data;
};
