import type { ReactNode } from "react";

type EditableDetailRowProps = {
  label: string;
  value: ReactNode;
  isEditable?: boolean;
  editor?: ReactNode;
  className?: string;
  valueClassName?: string;
};

export default function EditableDetailRow({
  label,
  value,
  isEditable = false,
  editor,
  className,
  valueClassName,
}: Readonly<EditableDetailRowProps>) {
  return (
    <div
      className={[
        "rounded-lg border border-slate-200 bg-slate-50 px-4 py-3",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      {isEditable && editor ? (
        <div className="mt-2">{editor}</div>
      ) : (
        <p className={`mt-2 text-sm font-medium text-slate-900 ${valueClassName ?? ""}`}>
          {value}
        </p>
      )}
    </div>
  );
}
