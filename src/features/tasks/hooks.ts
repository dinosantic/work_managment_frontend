import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "@/features/tasks/api";
import type {
  CreateTaskValues,
  Task,
  UpdateTaskValues,
} from "@/features/tasks/types";
import { toast } from "@/components/ui/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const TASKS_QUERY_KEY = ["tasks"];

export function useTasksQuery() {
  return useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: async () => {
      const response = await getTasks();

      return response;
    },
  });
}

export function useTaskQuery(taskId: number) {
  return useQuery({
    queryKey: [...TASKS_QUERY_KEY, taskId],
    queryFn: async () => {
      const response = await getTask(taskId);

      return response;
    },
    enabled: Number.isInteger(taskId) && taskId > 0,
  });
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      payload,
    }: {
      taskId: number;
      payload: UpdateTaskValues;
    }) => {
      const response = await updateTask(taskId, payload);

      return response;
    },
    onSuccess: (task) => {
      toast.success("Success", {
        description: "Task updated successfully",
      });
      queryClient.setQueryData<Task>([...TASKS_QUERY_KEY, task.id], task);
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (current = []) =>
        current.map((currentTask) =>
          currentTask.id === task.id ? task : currentTask,
        ),
      );
    },
    onError: (err: unknown) => {
      console.error("Task update error", err);
      if (err instanceof Error) {
        toast.error("Error", {
          description: err.message,
        });
      } else {
        toast.error("Error", {
          description: "An unknown error occurred. Please try again.",
        });
      }
    },
  });
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: number) => {
      await deleteTask(taskId);

      return taskId;
    },
    onSuccess: (taskId) => {
      toast.success("Success", {
        description: "Task deleted successfully",
      });
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (current = []) =>
        current.filter((task) => task.id !== taskId),
      );
      queryClient.removeQueries({
        queryKey: [...TASKS_QUERY_KEY, taskId],
      });
    },
    onError: (err: unknown) => {
      console.error("Task delete error", err);
      if (err instanceof Error) {
        toast.error("Error", {
          description: err.message,
        });
      } else {
        toast.error("Error", {
          description: "An unknown error occurred. Please try again.",
        });
      }
    },
  });
}

export function useTasks() {
  const queryClient = useQueryClient();
  const tasksQuery = useTasksQuery();

  const createTaskMutation = useMutation({
    mutationFn: async (payload: CreateTaskValues) => {
      const task = await createTask(payload);

      return task;
    },
    onSuccess: (task) => {
      toast.success("Success", {
        description: "Task created successfully",
      });
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (current = []) => [
        ...current,
        task,
      ]);
    },
    onError: (err: unknown) => {
      console.error("Task create error", err);
      if (err instanceof Error) {
        toast.error("Error", {
          description: err.message,
        });
      } else {
        toast.error("Error", {
          description: "An unknown error occurred. Please try again.",
        });
      }
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      const response = await deleteTask(taskId);

      return response;
    },
    onSuccess: (_, taskId) => {
      toast.success("Success", {
        description: "Task deleted successfully",
      });
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (current = []) =>
        current.filter((task) => task.id !== taskId),
      );
    },
    onError: (err: unknown) => {
      console.error("Task delete error", err);
      if (err instanceof Error) {
        toast.error("Error", {
          description: err.message,
        });
      } else {
        toast.error("Error", {
          description: "An unknown error occurred. Please try again.",
        });
      }
    },
  });

  return {
    tasksQuery,
    createTaskMutation,
    deleteTaskMutation,
  };
}
