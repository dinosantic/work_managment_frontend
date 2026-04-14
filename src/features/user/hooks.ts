import { editCurrentUser, getCurrentUser } from "@/features/user/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";

export function useCurrentUser() {
  const queryClient = useQueryClient();

  const currentUserQuery = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const response = await getCurrentUser();

      return response;
    },
  });

  const editCurrentUserMutation = useMutation({
    mutationFn: async (displayName: string) => {
      const user = await editCurrentUser(displayName);
      return user;
    },
    onSuccess: (user) => {
      toast.success("Success", {
        description: "Display name updated successfully",
      });
      queryClient.setQueryData(["current-user"], user);
    },
    onError: (err: unknown) => {
      console.error("User update error", err);
      if (err instanceof Error) {
        toast.error("Error", {
          description: err.message,
        });
      } else {
        toast.error("Error", {
          description: "An unknown error occurred. Please try again.",
        });
      }
    },
  });

  return { currentUserQuery, editCurrentUserMutation };
}
