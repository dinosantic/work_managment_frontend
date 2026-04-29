import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import {
  addProjectMember,
  createProject,
  deleteProject,
  getProject,
  getProjects,
  removeProjectMember,
} from "@/features/projects/api";
import type {
  AddProjectMemberValues,
  CreateProjectValues,
  Project,
} from "@/features/projects/types";

export const PROJECTS_QUERY_KEY = ["projects"];

export function useProjectsQuery() {
  return useQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: async () => {
      const response = await getProjects();

      return response;
    },
  });
}

export function useProjectDetails(projectId: number) {
  return useQuery({
    queryKey: [...PROJECTS_QUERY_KEY, projectId],
    queryFn: async () => {
      const response = await getProject(projectId);

      return response;
    },
    enabled: Number.isInteger(projectId) && projectId > 0,
  });
}

export function useProjects() {
  const queryClient = useQueryClient();
  const projectsQuery = useProjectsQuery();

  const createProjectMutation = useMutation({
    mutationFn: async (payload: CreateProjectValues) => {
      const project = await createProject(payload);

      return project;
    },
    onSuccess: (project) => {
      toast.success("Success", {
        description: "Project created successfully",
      });
      queryClient.setQueryData<Project[]>(PROJECTS_QUERY_KEY, (current = []) => [
        project,
        ...current,
      ]);
    },
    onError: (err: unknown) => {
      console.error("Project create error", err);
      toast.error("Error", {
        description: err instanceof Error ? err.message : "Failed to create project.",
      });
    },
  });

  const addProjectMemberMutation = useMutation({
    mutationFn: async ({
      projectId,
      payload,
    }: {
      projectId: number;
      payload: AddProjectMemberValues;
    }) => {
      await addProjectMember(projectId, payload);

      return { projectId, payload };
    },
    onSuccess: async ({ projectId }) => {
      toast.success("Success", {
        description: "Project member added successfully",
      });
      await queryClient.invalidateQueries({
        queryKey: [...PROJECTS_QUERY_KEY, projectId],
      });
    },
    onError: (err: unknown) => {
      console.error("Project member add error", err);
      toast.error("Error", {
        description:
          err instanceof Error ? err.message : "Failed to add project member.",
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: number) => {
      await deleteProject(projectId);

      return projectId;
    },
    onSuccess: async (projectId) => {
      toast.success("Success", {
        description: "Project deleted successfully",
      });
      queryClient.setQueryData<Project[]>(PROJECTS_QUERY_KEY, (current = []) =>
        current.filter((project) => project.id !== projectId),
      );
      await queryClient.invalidateQueries({
        queryKey: PROJECTS_QUERY_KEY,
      });
    },
    onError: (err: unknown) => {
      console.error("Project delete error", err);
      toast.error("Error", {
        description:
          err instanceof Error ? err.message : "Failed to delete project.",
      });
    },
  });

  const removeProjectMemberMutation = useMutation({
    mutationFn: async ({
      projectId,
      userId,
    }: {
      projectId: number;
      userId: number;
    }) => {
      await removeProjectMember(projectId, userId);

      return { projectId, userId };
    },
    onSuccess: async ({ projectId }) => {
      toast.success("Success", {
        description: "Project member removed successfully",
      });
      await queryClient.invalidateQueries({
        queryKey: [...PROJECTS_QUERY_KEY, projectId],
      });
    },
    onError: (err: unknown) => {
      console.error("Project member remove error", err);
      toast.error("Error", {
        description:
          err instanceof Error ? err.message : "Failed to remove project member.",
      });
    },
  });

  return {
    projectsQuery,
    createProjectMutation,
    addProjectMemberMutation,
    deleteProjectMutation,
    removeProjectMemberMutation,
  };
}
