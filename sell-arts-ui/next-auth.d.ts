// next-auth.d.ts
import { User as U } from "@/lib/type";
import "next-auth";

// Extend the default session object to include customData
declare module "next-auth" {
  interface Session {
    auth_token: string;
    user: U;
  }

  interface User extends DefaultUser {
    id: string;
    token: string;
    user: U;
  }
  interface Account {
    auth_token: string;
    user: U;
  }
}

// Extend the default JWT token object to include customData
declare module "next-auth/jwt" {
  interface JWT {
    auth_token: string;
    user: U;
  }
}
