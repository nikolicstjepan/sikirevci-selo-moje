import { createRouter } from "./context";
import { z } from "zod";

export const memoryRouter = createRouter()
  .mutation("create", {
    input: z.object({
      title: z.string(),
      description: z.string(),
      year: z.number(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.memory.create({ data: input });
    },
  })
  .query("list", {
    input: z
      .object({
        page: z.number().min(1).nullish().default(1),
      })
      .nullish(),
    async resolve({ ctx }) {
      return await ctx.prisma.memory.findMany();
    },
  });
