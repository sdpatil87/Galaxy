import { z } from "zod";

const entrySchema = z.object({
  type: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  duration: z.number().optional(),
  halfDay: z.boolean().optional(),
});

export const addAttendanceSchema = z.object({
  organization: z.string().optional(),
  date: z.string().optional(),
  entries: z.array(entrySchema).optional(),
});

export const rangeSummarySchema = z.object({
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  organization: z.string().optional(),
  user: z.string().optional(),
});

export const periodSummarySchema = z.object({
  period: z.enum(["week", "month"]),
  ref: z.string().optional(),
  organization: z.string().optional(),
  user: z.string().optional(),
});
