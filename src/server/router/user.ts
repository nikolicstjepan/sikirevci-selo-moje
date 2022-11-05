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
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
      });

      if (!user) {
        return null;
      }

      const _count = {
        memories: await ctx.prisma.memory.count({
          where: { userId: user.id, deleted: false },
        }),
        memoryLikes: await ctx.prisma.memoryLike.count({
          where: { userId: user.id, memory: { deleted: false } },
        }),
        memoryComments: await ctx.prisma.memoryComment.count({
          where: { userId: user.id, memory: { deleted: false } },
        }),
      };

      return { ...user, _count };
    },
  })
  .query("listAll", {
    async resolve({ ctx }) {
      const users = await ctx.prisma.user.findMany({
        include: {
          _count: { select: { memories: true } },
        },
      });

      return users;
    },
  });
