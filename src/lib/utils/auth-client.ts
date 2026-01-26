import { env } from "@/env";
import { createAuthClient } from "better-auth/client";
import { usernameClient } from "better-auth/client/plugins";

export const { signIn, signUp, useSession, getSession, signOut } =
  createAuthClient({
    baseURL: env.NEXT_PUBLIC_BASE_URL,
    plugins: [usernameClient()],
  });
