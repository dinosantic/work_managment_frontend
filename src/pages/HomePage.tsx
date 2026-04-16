import { useOutletContext } from "react-router-dom";
import { Fingerprint, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CurrentUser } from "@/features/user/types";

type LayoutOutletContext = {
  currentUser: CurrentUser | null;
};

export default function HomePage() {
  const { currentUser } = useOutletContext<LayoutOutletContext>();
  const quickFacts = currentUser
    ? [
        { label: "Display name", value: currentUser.displayName },
        { label: "Email", value: currentUser.email },
        { label: "Role", value: currentUser.role },
        { label: "User id", value: currentUser.id },
      ]
    : [];

  return (
    <div className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
      <Card className="border-slate-200 bg-slate-700 text-white">
        <CardHeader className="space-y-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-amber-100">
            <Sparkles className="size-3.5" />
            Dashboard overview
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-semibold tracking-tight text-white">
              Welcome back{currentUser ? `, ${currentUser.displayName}` : ""}.
            </CardTitle>
            <p className="max-w-xl text-sm text-slate-200">
              This starter dashboard now uses the backend current-user endpoint
              and can become the base for a larger role and permissions app.
            </p>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Badge className="border-white/10 bg-white/10 text-white hover:bg-white/10">
            <ShieldCheck className="mr-1 size-3.5" />
            Role-aware app
          </Badge>
          <Badge className="border-white/10 bg-white/10 text-white hover:bg-white/10">
            <Fingerprint className="mr-1 size-3.5" />
            Token-authenticated
          </Badge>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900">Current user</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {quickFacts.map((fact) => (
            <div
              key={fact.label}
              className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                {fact.label}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {fact.value}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
