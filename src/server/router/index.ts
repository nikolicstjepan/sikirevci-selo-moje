import { router } from "../trpc";

import { authRouter } from "./auth";
import { memoryRouter } from "./memory";
import { userRouter } from "./user";
import { adminRouter } from "./admin";

export const appRouter = router({ auth: authRouter, memory: memoryRouter, user: userRouter, admin: adminRouter });

export type AppRouter = typeof appRouter;
