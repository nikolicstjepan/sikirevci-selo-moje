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
  .mutation("edit", {
    input: z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      year: z.number(),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return await ctx.prisma.memory.update({
        where: { id: input.id },
        data: { ...input, userId: ctx.session.user.id, modifiedAt: new Date() },
      });
    },
  })
  .query("list", {
    input: z.object({
      cursor: z.number().nullish(),
      year: z.number().nullish(),
    }),
    async resolve({ ctx, input }) {
      const { year } = input;
      const count = await ctx.prisma.memory.count({
        where: {
          ...(year && { year }),
        },
      });
      const memories = await ctx.prisma.memory.findMany({
        where: {
          deleted: false,
          ...(year && { year }),
        },
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
        where: { deleted: false },
        _count: {
          year: true,
        },
      });

      return groupByYear;
    },
  })
  .query("getById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.memory.findFirst({
        where: { id: input.id, deleted: false },
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
        where: { userId: input.userId, deleted: false },
        include: { file: { select: { id: true, ext: true } }, user: true, _count: { select: { memoryLikes: true } } },
        orderBy: { createdAt: "desc" },
      });
    },
  })
  .query("listMy", {
    input: z.object({
      cursor: z.number().nullish(),
    }),
    async resolve({ ctx, input }) {
      const userId = ctx.session?.user?.id;

      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const count = await ctx.prisma.memory.count({
        where: { userId },
      });
      const memories = await ctx.prisma.memory.findMany({
        where: { userId, deleted: false },
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
  .query("listMyLiked", {
    async resolve({ ctx }) {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        return [];
      }

      const user = await ctx.prisma.user.findFirst({
        where: { id: userId, memoryLikes: { none: { memory: { deleted: true } } } },
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
      cursor: z.number().nullish(),
    }),
    async resolve({ ctx, input: { memoryId, cursor } }) {
      const count = await ctx.prisma.memoryComment.count({
        where: { memoryId },
      });

      const comments = await ctx.prisma.memoryComment.findMany({
        where: {
          memoryId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: RECORDS_PER_PAGE,
        skip: ((cursor || 1) - 1) * RECORDS_PER_PAGE,
        include: {
          user: true,
        },
      });

      return {
        nextCursor: ((cursor || 1) - 1) * RECORDS_PER_PAGE + comments.length < count ? (cursor || 1) + 1 : null,
        comments,
      };
    },
  })
  .mutation("remove", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input: { id } }) {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const memory = await ctx.prisma.memory.findUnique({ where: { id } });

      if (!memory) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (memory.userId !== userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return await ctx.prisma.memory.update({ where: { id }, data: { deleted: true } });
    },
  })
  .mutation("removeComment", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input: { id } }) {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const comment = await ctx.prisma.memoryComment.findUnique({ where: { id } });

      if (!comment) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (comment.userId !== userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return await ctx.prisma.memoryComment.deleteMany({
        where: {
          id,
        },
      });
    },
  });
