import api from "@/api/axios";
import type {
  CreateTaskValues,
  Task,
  UpdateTaskValues,
} from "@/features/tasks/types";

export async function getTasks() {
  const response = await api.get<Task[]>("/tasks");

  return response.data;
}

export async function getTask(taskId: number) {
  const response = await api.get<Task>(`/tasks/${taskId}`);

  return response.data;
}

export async function createTask(payload: CreateTaskValues) {
  const response = await api.post<Task>("/tasks", {
    ...payload,
    dueDate: payload.dueDate || null,
  });

  return response.data;
}

export async function updateTask(taskId: number, payload: UpdateTaskValues) {
  const response = await api.patch<Task>(`/tasks/${taskId}`, {
    ...payload,
    dueDate: payload.dueDate || null,
  });

  return response.data;
}

export async function deleteTask(taskId: number) {
  const response = await api.delete<{ message: string }>(`/tasks/${taskId}`);

  return response.data;
}
