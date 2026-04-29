import api from "@/api/axios";
import type {
  AddProjectMemberValues,
  CreateProjectValues,
  Project,
  ProjectDetails,
} from "@/features/projects/types";

export async function getProjects() {
  const response = await api.get<Project[]>("/projects");

  return response.data;
}

export async function getProject(projectId: number) {
  const response = await api.get<ProjectDetails>(`/projects/${projectId}`);

  return response.data;
}

export async function createProject(payload: CreateProjectValues) {
  const response = await api.post<Project>("/projects", payload);

  return response.data;
}

export async function addProjectMember(
  projectId: number,
  payload: AddProjectMemberValues,
) {
  const response = await api.post<void>(`/projects/${projectId}/members`, payload);

  return response.data;
}

export async function deleteProject(projectId: number) {
  await api.delete(`/projects/${projectId}`);
}
