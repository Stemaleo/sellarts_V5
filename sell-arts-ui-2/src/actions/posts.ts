"use server";

import { PageableResponse } from "@/lib/api";
import { fetchHelper } from "@/lib/fetchHelper";
import { ApiResponse, ArtWork, Comment, Event, Post } from "@/lib/type";

export const createPost = async (event: Partial<Post>, image: File) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(event));

  formData.append("image", image);

  const res = await fetchHelper(process.env.API_URL + "/posts", {
    method: "post",
    body: formData,
    headers: {},
  });

  const data: ApiResponse<Post> = await res.json();
  return data;
};

export const getMyPosts = async (page: number) => {
  const res = await fetchHelper(process.env.API_URL + `/posts/artist?page=${page}`, {
    method: "GET",
  });

  const data: ApiResponse<Post[]> = await res.json();

  return data;
};

export const getArtistPosts = async (artistId: number) => {
  const res = await fetchHelper(process.env.API_URL + `/posts/artist/${artistId}`, {
    method: "GET",
  });

  const data: ApiResponse<Post[]> = await res.json();

  return data;
};

export const getAllPosts = async (page: number) => {
  const res = await fetchHelper(process.env.API_URL + `/posts?page=${page}`, {
    method: "GET",
  });

  const data: ApiResponse<PageableResponse<Post>> = await res.json();

  return data;
};

export const likeThePost = async (postId: number) => {
  const res = await fetchHelper(process.env.API_URL + `/likes/${postId}`, {
    method: "POST",
  });

  const data: ApiResponse<number> = await res.json();

  return data;
};

export const commentOnThePost = async (postId: number, content: string) => {
  const res = await fetchHelper(process.env.API_URL + `/comments/${postId}`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });

  const data: ApiResponse<Comment> = await res.json();

  return data;
};
