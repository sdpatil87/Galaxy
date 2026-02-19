import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(1),
  address: z.string().optional(),
});

export const updateOrganizationSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
});
