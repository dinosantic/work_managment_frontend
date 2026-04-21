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
    bg: "bg-white",
    text: "text-[#84CC16]",
    border: "border-[#84CC16]",
  },
  warning: {
    icon: null,
    bg: "bg-white",
    text: "text-text-brand-default",
    border: "border-border-brand-default",
  },
  error: {
    icon: null,
    bg: "bg-white",
    text: "text-text-destructive-default",
    border: "border-border-destructive-default",
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
      className={`flex min-w-[350px] items-center gap-3 relative rounded-md p-4 shadow-lg ring-1 ring-black/5 border-1 ${v.border} bg-slate-700`}
    >
      {icon === null ? null : (icon ?? v.icon)}
      <div className="flex-1">
        <p className={`text-sm font-medium ${v.text}`}>{title}</p>
        {description && (
          <p className={`mt-1 text-sm text-white`}>{description}</p>
        )}
      </div>
      {action && (
        <div className="flex h-full justify-center items-center mr-4">
          <Button
            variant="outline"
            onClick={() => {
              action.onClick();
              sonnerToast.dismiss(id);
            }}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${v.text} hover:opacity-80 transition-opacity`}
          >
            {action.label}
          </Button>
          <button
            onClick={() => sonnerToast.dismiss(id)}
            className="absolute right-2 top-2 ml-3 opacity-70 hover:opacity-100 focus:outline-none cursor-pointer"
          >
            <X className={`h-4 w-4`} />
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
