import { authOptions } from "@/actions/nextAuth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const fetchHelper = async (url: string, options: RequestInit) => {
  const session = await getServerSession(authOptions);

  let headers: any = {
    Authorization: session?.auth_token != undefined ? "Bearer " + session?.auth_token : "",
  };

  if (options.headers) {
    headers = {
      ...headers,
      ...options.headers,
    };
  } else {
    headers = {
      ...headers,
      "Content-Type": "application/json",
    };
  }

  const response = await fetch(url, {
    ...options,
    headers: headers,
  });

  if (response.status == 401) {
    // console.error(await response.json());
    // logout();
    if (session?.user) {
      redirect("/logout");
    } else {
      redirect("/login");
    }
  }

  if (response.status == 500) {
    // TODO: fix this
    const tres = response.clone();
    const err = await tres.json();
    console.error(err);
  }

  return response;
};
