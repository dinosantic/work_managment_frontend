import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FolderKanban,
  Plus,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api";
import {
  getTaskDueDateMeta,
  getTaskPriorityMeta,
  getTaskStatusMeta,
} from "@/lib/utils";
import { addProjectMemberSchema } from "@/features/projects/schemas";
import type { AddProjectMemberValues } from "@/features/projects/types";
import { useProjectDetails, useProjects } from "@/features/projects/hooks";
import { useTasks } from "@/features/tasks/hooks";
import type { CreateTaskValues } from "@/features/tasks/types";
import { createTaskSchema } from "@/features/tasks/schemas";
import { useUsersDirectoryQuery } from "@/features/user/hooks";

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const parsedProjectId = Number(projectId);
  const projectDetailsQuery = useProjectDetails(parsedProjectId);
  const { addProjectMemberMutation } = useProjects();
  const { tasksQuery, createTaskMutation } = useTasks();
  const usersDirectoryQuery = useUsersDirectoryQuery();
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const addMemberForm = useForm<AddProjectMemberValues>({
    resolver: zodResolver(addProjectMemberSchema),
    defaultValues: {
      userId: 0,
      role: "MEMBER",
    },
  });

  const createTaskForm = useForm<CreateTaskValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      projectId: parsedProjectId,
      title: "",
      description: "",
      priority: "MEDIUM",
      dueDate: "",
      assigneeUserId: null,
    },
  });

  if (projectDetailsQuery.isLoading) {
    return <p className="text-sm text-slate-500">Loading project details...</p>;
  }

  if (projectDetailsQuery.isError) {
    return (
      <Alert className="border-red-200 bg-red-50 text-red-900">
        <AlertTitle>Could not load project</AlertTitle>
        <AlertDescription>
          {projectDetailsQuery.error instanceof ApiError
            ? projectDetailsQuery.error.message
            : "Unexpected error"}
        </AlertDescription>
      </Alert>
    );
  }

  if (
    !Number.isInteger(parsedProjectId) ||
    parsedProjectId <= 0 ||
    !projectDetailsQuery.data
  ) {
    return (
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">
            Project not found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link to="/projects">
              <ArrowLeft className="size-4" />
              Back to projects
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { project, members } = projectDetailsQuery.data;
  const availableUsers =
    usersDirectoryQuery.data?.filter(
      (user) => !members.some((member) => member.userId === user.id),
    ) ?? [];
  const projectTasks =
    tasksQuery.data?.filter((task) => task.projectId === project.id) ?? [];

  async function handleAddMember(values: AddProjectMemberValues) {
    await addProjectMemberMutation.mutateAsync({
      projectId: project.id,
      payload: values,
    });
    addMemberForm.reset({ userId: 0, role: "MEMBER" });
    setIsAddMemberOpen(false);
    projectDetailsQuery.refetch();
  }

  async function handleCreateTask(values: CreateTaskValues) {
    await createTaskMutation.mutateAsync({
      ...values,
      projectId: project.id,
    });
    createTaskForm.reset({
      projectId: project.id,
      title: "",
      description: "",
      priority: "MEDIUM",
      dueDate: "",
      assigneeUserId: null,
    });
    setIsCreateTaskOpen(false);
    tasksQuery.refetch();
  }

  return (
    <div className="space-y-4">
      <Card className="border-slate-200 bg-white">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-2">
            <Button
              asChild
              variant="ghost"
              className="-ml-3 w-fit px-3 text-slate-500 hover:bg-transparent hover:text-slate-900"
            >
              <Link to="/projects">
                <ArrowLeft className="size-4" />
                Back to projects
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <FolderKanban className="size-5 text-slate-700" />
              <CardTitle className="text-2xl text-slate-900">
                {project.name}
              </CardTitle>
            </div>
            <p className="max-w-2xl text-sm text-slate-600">
              {project.description || "No description provided."}
            </p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline">
                  <Users className="size-4" />
                  Add member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add project member</DialogTitle>
                  <DialogDescription>
                    Select a user from the directory, then assign a project role.
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={addMemberForm.handleSubmit(handleAddMember)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      User
                    </label>
                    <Select
                      value={
                        addMemberForm.watch("userId") > 0
                          ? String(addMemberForm.watch("userId"))
                          : undefined
                      }
                      onValueChange={(value) =>
                        addMemberForm.setValue("userId", Number(value), {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                      disabled={
                        usersDirectoryQuery.isLoading || !availableUsers.length
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectGroup>
                          {availableUsers.map((user) => (
                            <SelectItem key={user.id} value={String(user.id)}>
                              {user.displayName} ({user.email})
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {addMemberForm.formState.errors.userId && (
                      <p className="text-sm text-red-600">
                        {addMemberForm.formState.errors.userId.message}
                      </p>
                    )}
                    {!usersDirectoryQuery.isLoading && !availableUsers.length && (
                      <p className="text-sm text-slate-500">
                        No available users to add.
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Role
                    </label>
                    <Select
                      value={addMemberForm.watch("role")}
                      onValueChange={(value) =>
                        addMemberForm.setValue(
                          "role",
                          value as AddProjectMemberValues["role"],
                          {
                            shouldDirty: true,
                            shouldValidate: true,
                          },
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectGroup>
                          <SelectItem value="MEMBER">Member</SelectItem>
                          <SelectItem value="MANAGER">Manager</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddMemberOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={addProjectMemberMutation.isPending}
                    >
                      Add member
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
              <DialogTrigger asChild>
                <Button type="button">
                  <Plus className="size-4 text-white!" />
                  Create task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create task in {project.name}</DialogTitle>
                  <DialogDescription>
                    Tasks created here are automatically attached to this
                    project.
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={createTaskForm.handleSubmit(handleCreateTask)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Title
                    </label>
                    <Input {...createTaskForm.register("title")} />
                    {createTaskForm.formState.errors.title && (
                      <p className="text-sm text-red-600">
                        {createTaskForm.formState.errors.title.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Description
                    </label>
                    <Textarea {...createTaskForm.register("description")} />
                    {createTaskForm.formState.errors.description && (
                      <p className="text-sm text-red-600">
                        {createTaskForm.formState.errors.description.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Priority
                      </label>
                      <Select
                        value={createTaskForm.watch("priority")}
                        onValueChange={(value) =>
                          createTaskForm.setValue(
                            "priority",
                            value as CreateTaskValues["priority"],
                            {
                              shouldDirty: true,
                              shouldValidate: true,
                            },
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectGroup>
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Due date
                      </label>
                      <Input
                        type="date"
                        {...createTaskForm.register("dueDate")}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateTaskOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createTaskMutation.isPending}
                    >
                      Create task
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">
              Project tasks
            </CardTitle>
            <p className="text-sm text-slate-500">
              Visible tasks in this project based on your current permissions.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {!projectTasks.length && (
              <p className="text-sm text-slate-500">
                No visible tasks in this project yet.
              </p>
            )}
            {projectTasks.map((task) => {
              const statusMeta = getTaskStatusMeta(task.status);
              const priorityMeta = getTaskPriorityMeta(task.priority);
              const dueDateMeta = getTaskDueDateMeta(task.dueDate);

              return (
                <div
                  key={task.id}
                  className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <div className="font-medium text-slate-900">
                      {task.title}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <Badge variant={statusMeta.variant}>
                        {statusMeta.label}
                      </Badge>
                      <Badge variant={priorityMeta.variant}>
                        {priorityMeta.label} priority
                      </Badge>
                      <span className={dueDateMeta.className}>
                        {dueDateMeta.label}
                      </span>
                    </div>
                  </div>
                  <Button asChild variant="outline">
                    <Link to={`/tasks/${task.id}`}>Open task</Link>
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
              <ShieldCheck className="size-4 text-slate-700" />
              Members
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {member.user.displayName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {member.user.email} • Added {new Date(member.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={member.role === "MANAGER" ? "warning" : "outline"}
                  >
                    {member.role}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
