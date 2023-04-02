import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const userRouter = router({
  edit: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        image: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return await ctx.prisma.user.update({
        where: { id: input.id },
        data: { ...input },
      });
    }),
  myDetails: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return await ctx.prisma.user.findUnique({ where: { id: ctx.session.user.id } });
  }),
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
      });

      if (!user) {
        return null;
      }

      const _count = {
        memories: await ctx.prisma.memory.count({
          where: { userId: user.id, deleted: false, isDraft: false },
        }),
        memoryLikes: await ctx.prisma.memoryLike.count({
          where: { userId: user.id, memory: { deleted: false, isDraft: false } },
        }),
        memoryComments: await ctx.prisma.memoryComment.count({
          where: { userId: user.id, memory: { deleted: false, isDraft: false } },
        }),
      };

      return { ...user, _count };
    }),
  listAll: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      select: {
        name: true,
        image: true,
        id: true,
        _count: { select: { memories: { where: { deleted: false, isDraft: false } } } },
      },
    });

    return users;
  }),
});
