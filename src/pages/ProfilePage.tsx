import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditableDetailRow from "@/components/editable-detail-row";
import { Input } from "@/components/ui/input";
import type { CurrentUser } from "@/features/user/types";
import { useCurrentUser } from "@/features/user/hooks";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";

type LayoutOutletContext = {
  currentUser: CurrentUser;
};

export default function ProfilePage() {
  const { currentUser: user } = useOutletContext<LayoutOutletContext>();
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
        {user.role === "ADMIN" ? (
          <Badge
            variant="outline"
            className="border-emerald-600 text-emerald-600"
          >
            {user.role}
          </Badge>
        ) : null}
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <EditableDetailRow
          label="Display name"
          value={user.displayName}
          isEditable={isEditing}
          editor={
            <Input
              type="text"
              value={editedDisplayName}
              onChange={(e) => setEditedDisplayName(e.target.value)}
              autoFocus
              disabled={editCurrentUserMutation.isPending}
            />
          }
        />
        <EditableDetailRow label="Email" value={user.email} />
        <EditableDetailRow label="Role" value={user.role} />
        <EditableDetailRow label="User id" value={user.id} />
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
