import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { router, publicProcedure } from "../trpc";
import { ADMIN_ROLE } from "../../const";
import { logNewFeedback } from "../../utils/log";

export const adminRouter = router({
  createMemoryCategory: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id;
      const role = ctx.session?.user?.role;

      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      if (role !== ADMIN_ROLE) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const memoryCategory = await ctx.prisma.memoryCategory.create({ data: input });

      return memoryCategory;
    }),

  editMemoryCategory: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id;
      const role = ctx.session?.user?.role;

      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      if (role !== ADMIN_ROLE) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return await ctx.prisma.memoryCategory.update({
        where: { id: input.id },
        data: { ...input, modifiedAt: new Date() },
      });
    }),

  deleteMemoryCategory: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id;
      const role = ctx.session?.user?.role;

      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      if (role !== ADMIN_ROLE) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return await ctx.prisma.memoryCategory.delete({
        where: { id: input.id },
      });
    }),

  listMemoryCategories: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;
    const role = ctx.session?.user?.role;

    if (!userId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return await ctx.prisma.memoryCategory.findMany();
  }),

  createMemoryTag: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id;
      const role = ctx.session?.user?.role;

      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      if (role !== ADMIN_ROLE) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const memoryTag = await ctx.prisma.memoryTag.create({ data: input });

      return memoryTag;
    }),

  editMemoryTag: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id;
      const role = ctx.session?.user?.role;

      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      if (role !== ADMIN_ROLE) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return await ctx.prisma.memoryTag.update({
        where: { id: input.id },
        data: { ...input, modifiedAt: new Date() },
      });
    }),

  deleteMemoryTag: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id;
      const role = ctx.session?.user?.role;

      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      if (role !== ADMIN_ROLE) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return await ctx.prisma.memoryTag.delete({
        where: { id: input.id },
      });
    }),

  listMemoryTags: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;

    if (!userId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return await ctx.prisma.memoryTag.findMany();
  }),

  createFeedback: publicProcedure
    .input(
      z.object({
        body: z.string(),
        type: z.string(),
        attributes: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      const email = ctx.session?.user?.email;

      logNewFeedback(input.body, email!);

      return await ctx.prisma.feedback.create({ data: { ...input, userId } });
    }),

  listFeedbacks: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;
    const role = ctx.session?.user?.role;

    if (!userId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    if (role !== ADMIN_ROLE) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return await ctx.prisma.feedback.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  }),

  deleteFeedback: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      const role = ctx.session?.user?.role;

      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      if (role !== ADMIN_ROLE) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return await ctx.prisma.feedback.delete({ where: { id: input.id } });
    }),

  listUsers: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;
    const role = ctx.session?.user?.role;

    if (!userId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    if (role !== ADMIN_ROLE) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const users = await ctx.prisma.user.findMany({
      include: {
        _count: {
          select: {
            memories: { where: { deleted: false } },
            feedbacks: true,
            memoryComments: true,
            memoryLikes: true,
            memoryViews: true,
          },
        },
      },
    });

    return users;
  }),

  deleteUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      const role = ctx.session?.user?.role;

      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      if (role !== ADMIN_ROLE) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          accounts: {
            deleteMany: {},
          },
          sessions: {
            deleteMany: {},
          },
          memoryComments: {
            deleteMany: {},
          },
          memoryViews: {
            set: [],
          },
          memoryLikes: {
            deleteMany: {},
          },
        },
      });

      return await ctx.prisma.user.delete({ where: { id: input.id } });
    }),
});
