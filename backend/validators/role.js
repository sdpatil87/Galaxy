import { z } from "zod";

export const createRoleSchema = z.object({
  organization: z.string().min(1),
  name: z.string().min(1),
  permissions: z.array(z.string()).optional(),
});

export const updateRoleSchema = z.object({
  name: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});
