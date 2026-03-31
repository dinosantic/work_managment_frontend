import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CurrentUser } from "@/lib/api";

type ProfilePageProps = {
  user: CurrentUser;
};

function ProfileRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

export default function ProfilePage({ user }: ProfilePageProps) {
  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-xl text-slate-900">Profile</CardTitle>
          <p className="text-sm text-slate-500">
            Read-only account information from the backend.
          </p>
        </div>
        <Badge variant="outline">{user.role}</Badge>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <ProfileRow label="Display name" value={user.displayName} />
        <ProfileRow label="Email" value={user.email} />
        <ProfileRow label="Role" value={user.role} />
        <ProfileRow label="User id" value={user.id} />
      </CardContent>
    </Card>
  );
}
