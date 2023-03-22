import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { router, publicProcedure } from "../trpc";
import { ADMIN_ROLE } from "../../const";

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

  listMemoryCategories: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;
    const role = ctx.session?.user?.role;

    if (!userId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    if (role !== ADMIN_ROLE) {
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

  listMemoryTags: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;
    const role = ctx.session?.user?.role;

    if (!userId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    if (role !== ADMIN_ROLE) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return await ctx.prisma.memoryTag.findMany();
  }),
});
