import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";

const RECORDS_PER_PAGE = 10;

export const memoryRouter = router({
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        year: z.number(),
        fileId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return await ctx.prisma.memory.create({ data: { ...input, userId: ctx.session.user.id } });
    }),

  edit: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        year: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return await ctx.prisma.memory.update({
        where: { id: input.id },
        data: { ...input, userId: ctx.session.user.id, modifiedAt: new Date() },
      });
    }),

  listMemories: publicProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        year: z.number().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { year } = input;
      const count = await ctx.prisma.memory.count({
        where: {
          deleted: false,
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
        include: {
          file: { select: { id: true, ext: true } },
          user: true,
          _count: { select: { memoryLikes: true, memoryComments: true } },
        },
      });

      return {
        nextCursor:
          ((input?.cursor || 1) - 1) * RECORDS_PER_PAGE + memories.length < count ? (input?.cursor || 1) + 1 : null,
        memories,
      };
    }),

  getMemoriesYears: publicProcedure.query(async ({ ctx }) => {
    const groupByYear = await ctx.prisma.memory.groupBy({
      by: ["year"],
      where: { deleted: false },
      _count: {
        year: true,
      },
    });

    return groupByYear;
  }),
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.memory.findFirst({
        where: { id: input.id, deleted: false },
        include: {
          file: { select: { id: true, ext: true } },
          user: true,
          _count: { select: { memoryLikes: true, memoryComments: true } },
        },
      });
    }),
  getByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.memory.findMany({
        where: { userId: input.userId, deleted: false },
        include: {
          file: { select: { id: true, ext: true } },
          user: true,
          _count: { select: { memoryLikes: true, memoryComments: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    }),
  listMy: publicProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;

      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const count = await ctx.prisma.memory.count({
        where: { userId, deleted: false },
      });
      const memories = await ctx.prisma.memory.findMany({
        where: { userId, deleted: false },
        take: RECORDS_PER_PAGE,
        skip: ((input?.cursor || 1) - 1) * RECORDS_PER_PAGE,
        orderBy: { createdAt: "desc" },
        include: {
          file: { select: { id: true, ext: true } },
          user: true,
          _count: { select: { memoryLikes: true, memoryComments: true } },
        },
      });

      return {
        nextCursor:
          ((input?.cursor || 1) - 1) * RECORDS_PER_PAGE + memories.length < count ? (input?.cursor || 1) + 1 : null,
        memories,
      };
    }),
  listMyLikedMemoriesIds: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;
    if (!userId) {
      return [];
    }

    const memoryLikes = await ctx.prisma.memoryLike.findMany({
      where: { userId, memory: { deleted: false } },
      select: { memoryId: true },
    });

    return memoryLikes.map((m) => m.memoryId);
  }),
  listMyLiked: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;
    if (!userId) {
      return [];
    }

    const memoryLikes = await ctx.prisma.memoryLike.findMany({
      where: { userId, memory: { deleted: false } },
      include: {
        memory: {
          include: {
            file: { select: { id: true, ext: true } },
            user: true,
            _count: { select: { memoryLikes: true, memoryComments: true } },
          },
        },
      },
      orderBy: { memory: { createdAt: "desc" } },
    });

    return memoryLikes.map((m) => m.memory);
  }),
  listUsersLiked: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const memoryLikes = await ctx.prisma.memoryLike.findMany({
        where: { userId: input.userId, memory: { deleted: false } },
        include: {
          memory: {
            include: {
              file: { select: { id: true, ext: true } },
              user: true,
              _count: { select: { memoryLikes: true, memoryComments: true } },
            },
          },
        },
        orderBy: { memory: { createdAt: "desc" } },
      });

      return memoryLikes.map((m) => m.memory);
    }),
  listUsersComments: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const comments = await ctx.prisma.memoryComment.findMany({
        where: { userId: input.userId, memory: { deleted: false } },
        include: {
          memory: {
            include: {
              file: { select: { id: true, ext: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return comments;
    }),
  toggleLike: publicProcedure
    .input(
      z.object({
        memoryId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { memoryId } }) => {
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
    }),
  leaveComment: publicProcedure
    .input(
      z.object({
        memoryId: z.string(),
        body: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { memoryId, body } }) => {
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
    }),
  getCommentsByMemoryId: publicProcedure
    .input(
      z.object({
        memoryId: z.string(),
        cursor: z.number().nullish(),
      })
    )
    .query(async ({ ctx, input: { memoryId, cursor } }) => {
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
    }),
  remove: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { id } }) => {
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
    }),
  removeComment: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { id } }) => {
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
    }),
  createView: publicProcedure
    .input(
      z.object({
        memoryId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { memoryId } }) => {
      const userId = ctx.session?.user?.id;

      return await ctx.prisma.memoryView.create({
        data: {
          userId,
          memoryId,
        },
      });
    }),
});
