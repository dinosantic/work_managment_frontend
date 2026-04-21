import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
});

export const updateTaskSchema = createTaskSchema.extend({
  status: z.enum(["OPEN", "IN_PROGRESS", "DONE"]),
});
