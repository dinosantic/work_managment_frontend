import { LoaderCircle } from "lucide-react";

export default function SuspenseFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
        <LoaderCircle className="size-4 animate-spin" />
        Loading page...
      </div>
    </div>
  );
}
