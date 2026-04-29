import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required"),
  description: z.string().trim().min(1, "Project description is required"),
});

export const addProjectMemberSchema = z.object({
  userId: z.number().int().positive("User id must be a positive integer"),
  role: z.enum(["MANAGER", "MEMBER"]),
});
