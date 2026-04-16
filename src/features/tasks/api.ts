import api from "@/api/axios";
import type { Task, TaskStatus } from "@/features/tasks/types";

export async function getTasks() {
  const response = await api.get<Task[]>("/tasks");

  return response.data;
}

export async function getTask(taskId: number) {
  const response = await api.get<Task>(`/tasks/${taskId}`);

  return response.data;
}

export async function createTask(title: string) {
  const response = await api.post<Task>("/tasks", {
    title,
  });

  return response.data;
}

export async function updateTaskStatus(taskId: number, status: TaskStatus) {
  const response = await api.patch<{ message: string }>(`/tasks/${taskId}`, {
    status,
  });

  return response.data;
}

export async function deleteTask(taskId: number) {
  const response = await api.delete<{ message: string }>(`/tasks/${taskId}`);

  return response.data;
}
