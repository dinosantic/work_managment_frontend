import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProfilePageProps } from "@/features/user/types";
import { useCurrentUser } from "@/features/user/hooks";
import { Check } from "lucide-react";
import { useState } from "react";

function ProfileRow({
  label,
  value,
  isEditable = false,
  editedValue,
  onEditedValueChange,
  isPending = false,
  onConfirm,
}: Readonly<{
  label: string;
  value: string | number;
  isEditable?: boolean;
  editedValue?: string;
  onEditedValueChange?: (value: string) => void;
  isPending?: boolean;
  onConfirm?: () => void;
}>) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      {isEditable ? (
        <div className="mt-2 flex items-center gap-2">
          <input
            type="text"
            value={editedValue ?? ""}
            onChange={(e) => onEditedValueChange?.(e.target.value)}
            autoFocus
            disabled={isPending}
            className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
          />
          <Button
            variant="outline"
            size="sm"
            className="bg-slate-50 hover:bg-slate-200 hover:text-slate-900 cursor-pointer"
            onClick={onConfirm}
            disabled={isPending}
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <p className="mt-2 text-sm font-medium text-slate-900">{value}</p>
      )}
    </div>
  );
}

export default function ProfilePage({ user }: Readonly<ProfilePageProps>) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDisplayName, setEditedDisplayName] = useState(user.displayName);

  const { editCurrentUserMutation } = useCurrentUser();

  const onEdit = () => {
    setEditedDisplayName(user.displayName);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedDisplayName(user.displayName);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const trimmedDisplayName = editedDisplayName.trim();

    if (!trimmedDisplayName || trimmedDisplayName === user.displayName) {
      setEditedDisplayName(user.displayName);
      setIsEditing(false);
      return;
    }

    await editCurrentUserMutation.mutateAsync(trimmedDisplayName);
    setIsEditing(false);
  };

  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-xl text-slate-900">Profile</CardTitle>
        </div>
        <Badge variant="outline">{user.role}</Badge>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <ProfileRow
          label="Display name"
          value={user.displayName}
          isEditable={isEditing}
          editedValue={editedDisplayName}
          onEditedValueChange={setEditedDisplayName}
          isPending={editCurrentUserMutation.isPending}
          onConfirm={handleSave}
        />
        <ProfileRow label="Email" value={user.email} />
        <ProfileRow label="Role" value={user.role} />
        <ProfileRow label="User id" value={user.id} />
      </CardContent>
      <div className="flex items-center justify-end gap-4  px-6 pb-4 text-sm text-slate-500">
        <Button
          variant="outline"
          size="lg"
          className="bg-slate-50 hover:bg-slate-200 hover:text-slate-900 cursor-pointer"
          onClick={handleCancel}
          disabled={editCurrentUserMutation.isPending || !isEditing}
        >
          Cancel
        </Button>
        {isEditing ? (
          <Button
            variant="outline"
            size="lg"
            className="bg-slate-50 hover:bg-slate-200 hover:text-slate-900 cursor-pointer"
            onClick={handleSave}
            disabled={editCurrentUserMutation.isPending}
          >
            Save
          </Button>
        ) : (
          <Button
            variant="outline"
            size="lg"
            className="bg-slate-50 hover:bg-slate-200 hover:text-slate-900 cursor-pointer"
            onClick={onEdit}
          >
            Edit
          </Button>
        )}
      </div>
    </Card>
  );
}
