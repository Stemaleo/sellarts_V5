"use server";

import { fetchHelper } from "@/lib/fetchHelper";
import { ApiResponse, BlogType } from "@/lib/type";

export const getBlogs = async () => {
  const res = await fetchHelper(process.env.API_URL + `/blogs/all`, {
    method: "GET",
  });

  const data: ApiResponse<BlogType[]> = await res.json();

  return data;
};

export const getAllBlogs = async () => {
  const res = await fetchHelper(process.env.API_URL + `/blogs`, {
    method: "GET",
  });

  const data: ApiResponse<BlogType[]> = await res.json();

  return data;
};

export const createBlog = async (formData: BlogType) => {
  console.log(formData)
  const res = await fetchHelper(process.env.API_URL + `/blogs`, {
    method: "POST",
    body: JSON.stringify({
        ...formData,
    }),
  });

  const data: ApiResponse<BlogType[]> = await res.json();

  return data;
};

export const deleteBlog = async (id: string) => {
  const res = await fetchHelper(process.env.API_URL + `/blogs/${id}`, {
    method: "DELETE",
  });

  const data: ApiResponse<BlogType[]> = await res.json();

  return data;
};

export const updateBlog = async (formData: BlogType) => {
  const res = await fetchHelper(process.env.API_URL + `/blogs`, {
    method: "PUT",
    body: JSON.stringify({
      ...formData,
  }),
  });

  const data: ApiResponse<BlogType[]> = await res.json();

  return data;
};

export const getSingleBlog = async (id: string) => {
  const res: Response = await fetchHelper(process.env.API_URL + "/blogs/" + id, {
    method: "GET",
  });

  const data: ApiResponse<BlogType> = await res.json();

  return data;
};