import { z } from "zod";

export const userFilterSchema = z.object({
  q: z.string().optional(),
  organization: z.string().optional(),
});

export const userDetailSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});
