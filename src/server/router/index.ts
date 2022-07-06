// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { authRouter } from "./auth";
import { memoryRouter } from "./memory";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", authRouter)
  .merge("memory.", memoryRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
