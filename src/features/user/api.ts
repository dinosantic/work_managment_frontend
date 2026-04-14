import api from "@/api/axios";
import type { CurrentUser } from "@/features/user/types";

export async function getCurrentUser() {
  const response = await api.get<{ user: CurrentUser }>("/users/me");

  return response.data.user;
}

export async function editCurrentUser(displayName?: string) {
  const response = await api.patch<{ user: CurrentUser }>("/users/me", {
    displayName,
  });

  return response.data.user;
}
