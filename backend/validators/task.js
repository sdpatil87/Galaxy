import { z } from "zod";

export const createProjectSchema = z.object({
  organization: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
});

export const addTaskSchema = z.object({
  assignedTo: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["todo", "inprogress", "done"]).optional(),
});

export const addLogSchema = z.object({
  start: z.string().min(1),
  end: z.string().min(1),
  note: z.string().optional(),
});
