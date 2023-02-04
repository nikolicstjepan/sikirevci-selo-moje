// src/utils/trpc.ts
import type { AppRouter } from "../server/router";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
