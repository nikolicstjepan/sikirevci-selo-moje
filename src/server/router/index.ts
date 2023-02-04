import { router } from "../trpc";

import { authRouter } from "./auth";
import { memoryRouter } from "./memory";
import { userRouter } from "./user";

export const appRouter = router({ auth: authRouter, memory: memoryRouter, user: userRouter });

export type AppRouter = typeof appRouter;
