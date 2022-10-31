import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const userRouter = createRouter()
  .mutation("edit", {
    input: z.object({
      id: z.string(),
      name: z.string(),
      image: z.string(),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return await ctx.prisma.user.update({
        where: { id: input.id },
        data: { ...input },
      });
    },
  })
  .query("myDetails", {
    async resolve({ ctx }) {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return await ctx.prisma.user.findUnique({ where: { id: ctx.session.user.id } });
    },
  })
  .query("getById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.user.findUnique({
        where: { id: input.id },
        include: {
          _count: { select: { memories: true, memoryComments: true, memoryLikes: true } },
        },
      });
    },
  });
