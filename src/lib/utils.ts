import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { TaskPriority, TaskStatus } from "@/features/tasks/types";
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

export function getTaskPriorityMeta(priority: TaskPriority): {
  variant: BadgeProps["variant"];
  label: string;
} {
  if (priority === "HIGH") {
    return { variant: "danger", label: "High" };
  }

  if (priority === "LOW") {
    return { variant: "outline", label: "Low" };
  }

  return { variant: "warning", label: "Medium" };
}

export function getTaskDueDateMeta(dueDate: string | null): {
  label: string;
  className: string;
} {
  if (!dueDate) {
    return {
      label: "No due date",
      className: "text-slate-500",
    };
  }

  const now = new Date();
  const dueDateAtEndOfDay = new Date(`${dueDate}T23:59:59`);
  const msUntilDue = dueDateAtEndOfDay.getTime() - now.getTime();
  const dayInMs = 24 * 60 * 60 * 1000;

  if (msUntilDue < 0) {
    return {
      label: dueDate,
      className: "font-medium text-red-700",
    };
  }

  if (msUntilDue <= dayInMs) {
    return {
      label: dueDate,
      className: "font-medium text-amber-700",
    };
  }

  return {
    label: dueDate,
    className: "text-slate-600",
  };
}

export const sectionTitles = [
  { match: /^\/projects\/[^/]+$/, title: "Project Details" },
  { match: /^\/projects$/, title: "Projects" },
  { match: /^\/tasks\/[^/]+$/, title: "Task Details" },
  { match: /^\/tasks$/, title: "My Tasks" },
  { match: /^\/profile$/, title: "Profile" },
  { match: /^\/$/, title: "Overview" },
];
