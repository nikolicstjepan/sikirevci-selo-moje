import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const RECORDS_PER_PAGE = 10;

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
    input: z.object({
      cursor: z.number().nullish(),
    }),
    async resolve({ ctx, input }) {
      const count = await ctx.prisma.memory.count();
      const memories = await ctx.prisma.memory.findMany({
        take: RECORDS_PER_PAGE,
        skip: ((input?.cursor || 1) - 1) * RECORDS_PER_PAGE,
        orderBy: { createdAt: "desc" },
        include: { file: { select: { id: true, ext: true } }, user: true, _count: { select: { memoryLikes: true } } },
      });

      return {
        nextCursor:
          ((input?.cursor || 1) - 1) * RECORDS_PER_PAGE + memories.length < count ? (input?.cursor || 1) + 1 : null,
        memories,
      };
    },
  })
  .query("getMemoriesYears", {
    async resolve({ ctx }) {
      const groupByYear = await ctx.prisma.memory.groupBy({
        by: ["year"],
      });

      return groupByYear.map((m) => m.year);
    },
  })
  .query("getById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.memory.findUnique({
        where: { id: input.id },
        include: {
          file: { select: { id: true, ext: true } },
          user: true,
          _count: { select: { memoryLikes: true, memoryComments: true } },
        },
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
        return [];
      }

      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
        include: { memoryLikes: { select: { memoryId: true } } },
      });

      return user?.memoryLikes.map((m) => m.memoryId) || [];
    },
  })
  .mutation("toggleLike", {
    input: z.object({
      memoryId: z.string(),
    }),
    async resolve({ ctx, input: { memoryId } }) {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const liked = await ctx.prisma.memoryLike.findFirst({ where: { userId, memoryId } });

      if (liked) {
        await ctx.prisma.memoryLike.delete({
          where: {
            id: liked.id,
          },
        });
      } else {
        await ctx.prisma.memoryLike.create({
          data: {
            userId,
            memoryId,
          },
        });
      }

      return;
    },
  })
  .mutation("leaveComment", {
    input: z.object({
      memoryId: z.string(),
      body: z.string(),
    }),
    async resolve({ ctx, input: { memoryId, body } }) {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return await ctx.prisma.memoryComment.create({
        data: {
          userId,
          memoryId,
          body,
        },
      });
    },
  })
  .query("getCommentsByMemoryId", {
    input: z.object({
      memoryId: z.string(),
      commentCount: z.number(),
    }),
    async resolve({ ctx, input: { memoryId, commentCount } }) {
      return await ctx.prisma.memoryComment.findMany({
        where: {
          memoryId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: commentCount,
        include: {
          user: true,
        },
      });
    },
  });
