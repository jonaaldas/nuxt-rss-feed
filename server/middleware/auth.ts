import { auth } from "../lib/auth";
import type { Session, User } from "better-auth";

export type AuthContext = {
  user: User | null;
  session: Session | null;
};

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });
  
  event.context.auth = {
    user: session?.user || null,
    session: session?.session || null,
  };
});