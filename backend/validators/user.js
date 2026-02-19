import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  // password changes handled separately if needed
});

export const roleAssignmentSchema = z.object({
  userId: z.string().min(1),
  orgId: z.string().min(1),
  roleId: z.string().min(1),
});

export const removeRoleSchema = roleAssignmentSchema;
