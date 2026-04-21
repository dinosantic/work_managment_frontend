import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { TaskStatus } from "@/features/tasks/types";
import type { BadgeProps } from "@/components/ui/badge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTaskStatusMeta(status: TaskStatus): {
  variant: BadgeProps["variant"];
  label: string;
} {
  if (status === "DONE") {
    return { variant: "success", label: "Done" };
  }

  if (status === "IN_PROGRESS") {
    return { variant: "warning", label: "In progress" };
  }

  return { variant: "muted", label: "Open" };
}

export const sectionTitles = [
  { match: /^\/tasks\/[^/]+$/, title: "Task Details" },
  { match: /^\/tasks$/, title: "Tasks" },
  { match: /^\/profile$/, title: "Profile" },
  { match: /^\/$/, title: "Overview" },
];
