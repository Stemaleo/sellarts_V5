import { ApiResponse, LoginResponse } from "@/lib/type";
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import type { AuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  secret: "fb03e0db8a8097047b6dccba427337204ab78fdf",
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const res = await fetch(process.env.API_URL + "/auth/login", {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
        const data: ApiResponse<LoginResponse> = await res.json();
        const user = data.data;

        if (res.ok && user) {
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ account, user }) {
      if (account?.type != "credentials" && account?.access_token == undefined) {
        return false;
      }
      account.auth_token = user.token;
      account.user = user.user;
      return true;
    },
    jwt({ account, token, trigger, session }) {
      if (account && account.auth_token) {
        token.auth_token = account.auth_token;
        token.user = account.user;
      }
      if (trigger === "update" && session?.user) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.user = session.user;
      }
      return token;
    },
    session({ session, token }) {
      session.auth_token = token.auth_token;
      session.user = token.user;
      return session;
    },
  },
};

// Use it in server contexts
export function auth(...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []) {
  return getServerSession(...args, authOptions);
}
