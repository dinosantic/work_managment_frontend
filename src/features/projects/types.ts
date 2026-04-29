import type { UserDirectoryItem } from "@/features/user/types";

export type Project = {
  id: number;
  name: string;
  description: string | null;
  createdById: number;
  createdAt: string;
};

export type ProjectMemberRole = "MANAGER" | "MEMBER";

export type ProjectMember = {
  id: number;
  projectId: number;
  userId: number;
  role: ProjectMemberRole;
  createdAt: string;
  user: UserDirectoryItem;
};

export type ProjectDetails = {
  project: Project;
  members: ProjectMember[];
};

export type CreateProjectValues = {
  name: string;
  description: string;
};

export type AddProjectMemberValues = {
  userId: number;
  role: ProjectMemberRole;
};
