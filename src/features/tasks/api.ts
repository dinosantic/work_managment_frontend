import api from "@/api/axios";
import type { Task, UpdateTaskValues } from "@/features/tasks/types";

export async function getTasks() {
  const response = await api.get<Task[]>("/tasks");

  return response.data;
}

export async function getTask(taskId: number) {
  const response = await api.get<Task>(`/tasks/${taskId}`);

  return response.data;
}

export async function createTask({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const response = await api.post<Task>("/tasks", {
    title,
    description,
  });

  return response.data;
}

export async function updateTask(taskId: number, payload: UpdateTaskValues) {
  const response = await api.patch<Task>(`/tasks/${taskId}`, {
    ...payload,
  });

  return response.data;
}

export async function deleteTask(taskId: number) {
  const response = await api.delete<{ message: string }>(`/tasks/${taskId}`);

  return response.data;
}
