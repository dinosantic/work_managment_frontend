import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { CheckCircle2, Eye, ListTodo, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { useTasks } from "@/features/tasks/hooks";
import {
  getTaskDueDateMeta,
  getTaskPriorityMeta,
  getTaskStatusMeta,
} from "@/lib/utils";
import type { CreateTaskValues } from "@/features/tasks/types";
import { createTaskSchema } from "@/features/tasks/schemas";

export default function TasksPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { tasksQuery, createTaskMutation } = useTasks();
  const form = useForm<CreateTaskValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      dueDate: "",
      assigneeUserId: null,
    },
  });

  async function handleAddTask(values: CreateTaskValues) {
    await createTaskMutation.mutateAsync(values);
    form.reset();
    setIsCreateDialogOpen(false);
  }

  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-xl">
            <ListTodo className="size-5 text-amber-500" />
            Tasks
          </CardTitle>
        </div>
        <div className="flex items-center gap-3">
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={(nextOpen) => {
              setIsCreateDialogOpen(nextOpen);
              if (!nextOpen) {
                form.reset();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button type="button">
                <Plus className="size-4 text-white!" />
                Create task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create task</DialogTitle>
                <DialogDescription>
                  Add a new task with a title and description.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={form.handleSubmit(handleAddTask)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label
                    htmlFor="task-title"
                    className="text-sm font-medium text-slate-700"
                  >
                    Title
                  </label>
                  <Input
                    id="task-title"
                    placeholder="Enter task title"
                    {...form.register("title")}
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="task-description"
                    className="text-sm font-medium text-slate-700"
                  >
                    Description
                  </label>
                  <Textarea
                    id="task-description"
                    placeholder="Describe the task"
                    {...form.register("description")}
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Priority
                    </label>
                    <Select
                      value={form.watch("priority")}
                      onValueChange={(value) =>
                        form.setValue("priority", value as CreateTaskValues["priority"], {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
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
                    <label
                      htmlFor="task-due-date"
                      className="text-sm font-medium text-slate-700"
                    >
                      Due date
                    </label>
                    <Input
                      id="task-due-date"
                      type="date"
                      {...form.register("dueDate")}
                    />
                    {form.formState.errors.dueDate && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.dueDate.message}
                      </p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      form.reset();
                      setIsCreateDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createTaskMutation.isPending}>
                    <Plus className="size-4" />
                    Create task
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasksQuery.isLoading && (
          <p className="text-sm text-slate-500">Loading tasks...</p>
        )}
        <ul className="space-y-3">
          {tasksQuery.data?.map((task) => {
            const statusMeta = getTaskStatusMeta(task.status);
            const priorityMeta = getTaskPriorityMeta(task.priority);
            const dueDateMeta = getTaskDueDateMeta(task.dueDate);
            return (
              <li
                key={task.id}
                className="flex flex-col gap-4 rounded-lg border border-slate-300 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {task.status === "DONE" ? (
                      <CheckCircle2 className="size-4 text-emerald-600" />
                    ) : (
                      <ListTodo className="size-4 text-slate-500" />
                    )}
                    <span className="font-medium text-slate-900">
                      {task.title}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <Badge
                      variant={statusMeta.variant}
                    >
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
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button asChild type="button" variant="outline" size="icon">
                    <Link to={`/tasks/${task.id}`}>
                      <Eye className="size-4" />
                      <span className="sr-only">Open task details</span>
                    </Link>
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
