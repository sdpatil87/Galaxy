import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  isSuperAdmin: z.boolean().optional(),
  orgName: z.string().optional(),
  orgAddress: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const switchOrgSchema = z.object({
  orgId: z.string().min(1),
});
