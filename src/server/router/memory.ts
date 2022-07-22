import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const memoryRouter = createRouter()
  .mutation("create", {
    input: z.object({
      title: z.string(),
      description: z.string(),
      year: z.number(),
      fileId: z.string(),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return await ctx.prisma.memory.create({ data: { ...input, userId: ctx.session.user.id } });
    },
  })
  .query("list", {
    input: z
      .object({
        page: z.number().min(1).nullish().default(1),
      })
      .nullish(),
    async resolve({ ctx }) {
      return await ctx.prisma.memory.findMany({
        include: { file: { select: { id: true, ext: true } }, user: true, _count: { select: { memoryLikes: true } } },
      });
    },
  })
  .query("getById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.memory.findUnique({
        where: { id: input.id },
        include: { file: { select: { id: true, ext: true } }, user: true, _count: { select: { memoryLikes: true } } },
      });
    },
  })
  .query("getByUserId", {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.memory.findMany({
        where: { userId: input.userId },
        include: { file: { select: { id: true, ext: true } }, user: true, _count: { select: { memoryLikes: true } } },
      });
    },
  })
  .query("listMy", {
    async resolve({ ctx }) {
      const userId = ctx.session?.user?.id;

      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return await ctx.prisma.memory.findMany({
        where: { userId },
        include: { file: { select: { id: true, ext: true } }, user: true, _count: { select: { memoryLikes: true } } },
      });
    },
  })
  .query("listMyLiked", {
    async resolve({ ctx }) {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
        include: { memoryLikes: { select: { id: true } } },
      });

      return user?.memoryLikes.map((m) => m.id) || [];
    },
  });
