import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ListTodo, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EditableDetailRow from "@/components/editable-detail-row";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProjectDetails } from "@/features/projects/hooks";
import {
  useDeleteTaskMutation,
  useTaskQuery,
  useUpdateTaskMutation,
} from "@/features/tasks/hooks";
import { ApiError } from "@/lib/api";
import { updateTaskSchema } from "@/features/tasks/schemas";
import type { TaskStatus, UpdateTaskValues } from "@/features/tasks/types";
import { getTaskPriorityMeta, getTaskStatusMeta } from "@/lib/utils";
import { useCurrentUser } from "@/features/user/hooks";

export default function TaskDetailsPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const parsedTaskId = Number(taskId);

  const taskQuery = useTaskQuery(parsedTaskId);
  const projectDetailsQuery = useProjectDetails(
    taskQuery.data?.projectId ?? -1,
  );
  const updateTaskMutation = useUpdateTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();
  const { currentUserQuery } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<UpdateTaskValues>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "OPEN",
      priority: "MEDIUM",
      dueDate: "",
      assigneeUserId: null,
    },
  });
  const taskData = taskQuery.data;
  const { errors, isDirty } = form.formState;

  useEffect(() => {
    if (!taskData) {
      return;
    }

    form.reset({
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      priority: taskData.priority,
      dueDate: taskData.dueDate ?? "",
      assigneeUserId: taskData.assigneeUserId,
    });
  }, [form, taskData]);

  if (taskQuery.isLoading) {
    return <p className="text-sm text-slate-500">Loading task details...</p>;
  }

  if (taskQuery.isError) {
    return (
      <Alert className="border-red-200 bg-red-50 text-red-900">
        <AlertTitle>Could not load task</AlertTitle>
        <AlertDescription>
          {taskQuery.error instanceof ApiError
            ? taskQuery.error.message
            : "Unexpected error"}
        </AlertDescription>
      </Alert>
    );
  }

  if (!Number.isInteger(parsedTaskId) || parsedTaskId <= 0 || !taskQuery.data) {
    return (
      <Card className="border-slate-200 bg-white">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl text-slate-900">
            Task not found
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600">
            We could not find a task for ID {taskId ?? "unknown"}.
          </p>
          <Button asChild variant="outline">
            <Link to="/tasks">
              <ArrowLeft className="size-4" />
              Back to tasks
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const task = taskQuery.data;

  const currentUser = currentUserQuery.data;
  const canDeleteTask =
    currentUser?.role === "ADMIN" || currentUser?.id === task.createdById;
  const priorityMeta = getTaskPriorityMeta(task.priority);

  const handleEdit = () => {
    form.reset({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ?? "",
      assigneeUserId: task.assigneeUserId,
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.reset({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ?? "",
      assigneeUserId: task.assigneeUserId,
    });
    setIsEditing(false);
  };

  const handleSave = async (values: UpdateTaskValues) => {
    const trimmedValues: UpdateTaskValues = {
      title: values.title.trim(),
      description: values.description.trim(),
      status: values.status,
      priority: values.priority,
      dueDate: values.dueDate,
      assigneeUserId: values.assigneeUserId,
    };

    if (
      trimmedValues.title === task.title &&
      trimmedValues.description === task.description &&
      trimmedValues.status === task.status &&
      trimmedValues.priority === task.priority &&
      trimmedValues.dueDate === (task.dueDate ?? "") &&
      trimmedValues.assigneeUserId === task.assigneeUserId
    ) {
      setIsEditing(false);
      form.reset(trimmedValues);
      return;
    }

    try {
      await updateTaskMutation.mutateAsync({
        taskId: task.id,
        payload: trimmedValues,
      });
      form.reset(trimmedValues);
      setIsEditing(false);
    } catch (error) {
      if (!(error instanceof ApiError) || !error.details) {
        return;
      }

      for (const detail of error.details) {
        if (
          detail.field === "title" ||
          detail.field === "description" ||
          detail.field === "status" ||
          detail.field === "priority" ||
          detail.field === "dueDate" ||
          detail.field === "assigneeUserId"
        ) {
          form.setError(detail.field, {
            type: "server",
            message: detail.message ?? "Invalid value",
          });
        }
      }
    }
  };

  const handleDelete = async () => {
    const shouldDelete = window.confirm(
      `Delete task "${task.title}"? This action cannot be undone.`,
    );

    if (!shouldDelete) {
      return;
    }

    await deleteTaskMutation.mutateAsync(task.id);
    navigate("/tasks");
  };

  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <Button
            asChild
            variant="ghost"
            className="-ml-3 w-fit px-3 text-slate-500 hover:bg-transparent hover:text-slate-900"
          >
            <Link to="/tasks">
              <ArrowLeft className="size-4" />
              Back to tasks
            </Link>
          </Button>
          <CardTitle className="flex items-center gap-2 text-2xl text-slate-900">
            {task.status === "DONE" ? (
              <CheckCircle2 className="size-5 text-emerald-600" />
            ) : (
              <ListTodo className="size-5 text-amber-500" />
            )}
            {task.title}
          </CardTitle>
        </div>
        {canDeleteTask && (
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteTaskMutation.isPending}
          >
            <Trash2 className="size-4" />
            Delete task
          </Button>
        )}
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <EditableDetailRow
          label="Title"
          value={task.title}
          isEditable={isEditing}
          editor={
            <div className="space-y-2">
              <Input
                type="text"
                autoFocus
                disabled={updateTaskMutation.isPending}
                aria-invalid={errors.title ? "true" : "false"}
                className={
                  errors.title
                    ? "border-red-500 focus-visible:ring-red-400"
                    : undefined
                }
                {...form.register("title")}
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>
          }
        />
        <EditableDetailRow
          label="Status"
          value={getTaskStatusMeta(task.status).label}
          isEditable={isEditing}
          editor={
            <div className="space-y-2">
              <Select
                onValueChange={(value) =>
                  form.setValue("status", value as TaskStatus, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                value={form.watch("status")}
                disabled={updateTaskMutation.isPending}
              >
                <SelectTrigger
                  className={`h-10 w-full rounded-md border bg-white px-3 text-sm text-slate-900 shadow-xs focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.status
                      ? "border-red-500 focus-visible:ring-red-400"
                      : "border-slate-300 focus-visible:ring-amber-400"
                  }`}
                  aria-invalid={errors.status ? "true" : "false"}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="IN_PROGRESS">In progress</SelectItem>
                    <SelectItem value="DONE">Done</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>
          }
        />
        <EditableDetailRow
          label="Priority"
          value={priorityMeta.label}
          isEditable={isEditing}
          editor={
            <div className="space-y-2">
              <Select
                onValueChange={(value) =>
                  form.setValue(
                    "priority",
                    value as UpdateTaskValues["priority"],
                    {
                      shouldDirty: true,
                      shouldValidate: true,
                    },
                  )
                }
                value={form.watch("priority")}
                disabled={updateTaskMutation.isPending}
              >
                <SelectTrigger
                  className={`h-10 w-full rounded-md border bg-white px-3 text-sm text-slate-900 shadow-xs focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.priority
                      ? "border-red-500 focus-visible:ring-red-400"
                      : "border-slate-300 focus-visible:ring-amber-400"
                  }`}
                  aria-invalid={errors.priority ? "true" : "false"}
                >
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
              {errors.priority && (
                <p className="text-sm text-red-600">
                  {errors.priority.message}
                </p>
              )}
            </div>
          }
        />
        <EditableDetailRow
          label="Due date"
          value={task.dueDate ?? "Not set"}
          isEditable={isEditing}
          editor={
            <div className="space-y-2">
              <Input
                type="date"
                disabled={updateTaskMutation.isPending}
                aria-invalid={errors.dueDate ? "true" : "false"}
                className={
                  errors.dueDate
                    ? "border-red-500 focus-visible:ring-red-400"
                    : undefined
                }
                {...form.register("dueDate")}
              />
              {errors.dueDate && (
                <p className="text-sm text-red-600">{errors.dueDate.message}</p>
              )}
            </div>
          }
        />
        <EditableDetailRow
          label="Description"
          value={task.description}
          isEditable={isEditing}
          valueClassName="font-normal"
          editor={
            <div className="space-y-2">
              <Textarea
                disabled={updateTaskMutation.isPending}
                aria-invalid={errors.description ? "true" : "false"}
                className={
                  errors.description
                    ? "border-red-500 focus-visible:ring-red-400"
                    : undefined
                }
                {...form.register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>
          }
        />
        <EditableDetailRow
          label="Project"
          value={
            projectDetailsQuery.isLoading ? (
              "Loading project..."
            ) : (
              <Link
                to={`/projects/${task.projectId}`}
                className="text-slate-900 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-700 hover:decoration-slate-500"
              >
                {projectDetailsQuery.data?.project.name ??
                  `Project #${task.projectId}`}
              </Link>
            )
          }
          isEditable={false}
          editor={null}
        />
      </CardContent>
      <div className="flex items-center justify-end gap-4 px-6 pb-4 text-sm text-slate-500">
        <Button
          variant="outline"
          size="lg"
          className="bg-slate-50 hover:bg-slate-200 hover:text-slate-900 cursor-pointer"
          onClick={handleCancel}
          disabled={updateTaskMutation.isPending || !isEditing}
        >
          Cancel
        </Button>
        {isEditing ? (
          <Button
            variant="outline"
            size="lg"
            className="bg-slate-50 hover:bg-slate-200 hover:text-slate-900 cursor-pointer"
            onClick={form.handleSubmit(handleSave)}
            disabled={updateTaskMutation.isPending || !isDirty}
          >
            Save
          </Button>
        ) : (
          <Button
            variant="outline"
            size="lg"
            className="bg-slate-50 hover:bg-slate-200 hover:text-slate-900 cursor-pointer"
            onClick={handleEdit}
          >
            Edit
          </Button>
        )}
      </div>
    </Card>
  );
}
