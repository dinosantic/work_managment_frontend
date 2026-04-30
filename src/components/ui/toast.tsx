import React from "react";
import { toast as sonnerToast } from "sonner";
import { Button } from "./button";
import { X } from "lucide-react";

export type ToastVariant = "success" | "warning" | "error";

export interface ToastOptions {
  description?: string;
  icon?: React.ReactNode | null;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const map = {
  success: {
    icon: null,
    bg: "bg-slate-500",
    titleText: "text-[#84CC16]",
    descriptionText: "text-white",
    border: "border-[#84CC16]",
    iconText: "text-[#84CC16]",
  },
  warning: {
    icon: null,
    bg: "bg-slate-500",
    titleText: "text-amber-700",
    descriptionText: "text-white",
    border: "border-border-brand-default",
    iconText: "text-amber-700",
  },
  error: {
    icon: null,
    bg: "bg-slate-500",
    titleText: "text-red-600",
    descriptionText: "text-white",
    border: "border-red-500",
    iconText: "text-red-600",
  },
} as const;
interface ToastCardProps extends ToastOptions {
  id: string | number;
  variant: ToastVariant;
  title: string;
}

function ToastCard(props: Readonly<ToastCardProps>) {
  const { id, variant, title, description, icon, action } = props;
  const v = map[variant];

  return (
    <div
      className={`relative flex min-w-[350px] items-center gap-3 rounded-md border p-4 shadow-lg ring-1 ring-black/5 ${v.border} ${v.bg}`}
    >
      {icon === null ? null : (icon ?? v.icon)}
      <div className="flex-1">
        <p className={`text-sm font-medium ${v.titleText}`}>{title}</p>
        {description && (
          <p className={`mt-1 text-sm ${v.descriptionText}`}>{description}</p>
        )}
      </div>
      {action && (
        <div className="mr-4 flex h-full items-center justify-center">
          <Button
            variant="outline"
            onClick={() => {
              action.onClick();
              sonnerToast.dismiss(id);
            }}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-opacity hover:opacity-80 ${v.titleText}`}
          >
            {action.label}
          </Button>
          <button
            onClick={() => sonnerToast.dismiss(id)}
            className="absolute right-2 top-2 ml-3 opacity-70 hover:opacity-100 focus:outline-none cursor-pointer"
          >
            <X className={`h-4 w-4 ${v.iconText}`} />
          </button>
        </div>
      )}
    </div>
  );
}

function build(variant: ToastVariant) {
  return (title: string, opts: ToastOptions = {}) =>
    sonnerToast.custom(
      (id) => <ToastCard id={id} variant={variant} title={title} {...opts} />,
      { duration: opts.duration },
    );
}

export const toast = {
  success: build("success"),
  warning: build("warning"),
  error: build("error"),
  dismiss: sonnerToast.dismiss,
};
