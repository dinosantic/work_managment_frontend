import { z } from "zod";
import type { createTaskSchema, updateTaskSchema } from "./schemas";

export type TaskStatus = "OPEN" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type TaskListScope = "assigned" | "created" | "project";

export type Task = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdById: number;
  assigneeUserId: number | null;
  projectId: number;
};

export type GetTasksParams = {
  projectId?: number;
  scope?: TaskListScope;
};

export type CreateTaskValues = z.infer<typeof createTaskSchema>;

export type UpdateTaskValues = z.infer<typeof updateTaskSchema>;
