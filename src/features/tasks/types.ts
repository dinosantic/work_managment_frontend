import { z } from "zod";
import type { createTaskSchema, updateTaskSchema } from "./schemas";

export type TaskStatus = "OPEN" | "IN_PROGRESS" | "DONE";

export type Task = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  user_id?: number;
};

export type CreateTaskValues = z.infer<typeof createTaskSchema>;

export type UpdateTaskValues = z.infer<typeof updateTaskSchema>;
