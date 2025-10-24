import { initTRPC, TRPCError } from "@trpc/server";
import type { H3Event } from "h3";
import { auth } from "../lib/auth";
import { db } from "../database";

export const createTRPCContext = async (event: H3Event) => {
  const authSession = await auth.api.getSession({
    headers: event.headers,
  });

  return {
    db,
    session: authSession,
    user: authSession?.user,
    event: event,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

export const publicProcedure = t.procedure;

const authMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.user?.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(authMiddleware);
