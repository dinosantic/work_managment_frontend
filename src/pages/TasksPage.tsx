import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ListTodo, Plus, Trash2 } from "lucide-react";
import { ApiError } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTasks } from "@/features/tasks/hooks";
import type { TaskStatus } from "@/features/tasks/types";

function statusVariant(status: TaskStatus) {
  if (status === "DONE") return "success" as const;
  if (status === "IN_PROGRESS") return "warning" as const;
  return "muted" as const;
}

export default function TasksPage() {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const {
    tasksQuery,
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
  } = useTasks();

  async function handleAddTask(e: FormEvent) {
    e.preventDefault();
    if (!newTaskTitle) return;

    await createTaskMutation.mutateAsync(newTaskTitle);
    setNewTaskTitle("");
  }

  async function handleUpdateTaskStatus(taskId: number, status: TaskStatus) {
    await updateTaskMutation.mutateAsync({ taskId, status });
  }

  async function handleDeleteTask(taskId: number) {
    await deleteTaskMutation.mutateAsync(taskId);
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
        <Badge variant="outline">{tasksQuery.data?.length ?? 0} items</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasksQuery.isLoading && (
          <p className="text-sm text-slate-500">Loading tasks...</p>
        )}

        {tasksQuery.isError && (
          <Alert className="border-red-200 bg-red-50 text-red-900">
            <AlertTitle>Could not load tasks</AlertTitle>
            <AlertDescription>
              {tasksQuery.error instanceof ApiError
                ? tasksQuery.error.message
                : "Unexpected error"}
            </AlertDescription>
          </Alert>
        )}

        {(createTaskMutation.isError ||
          updateTaskMutation.isError ||
          deleteTaskMutation.isError) && (
          <Alert className="border-red-200 bg-red-50 text-red-900">
            <AlertTitle>Task request failed</AlertTitle>
            <AlertDescription>
              {(createTaskMutation.error as ApiError | null)?.message ||
                (updateTaskMutation.error as ApiError | null)?.message ||
                (deleteTaskMutation.error as ApiError | null)?.message ||
                "Unexpected error"}
            </AlertDescription>
          </Alert>
        )}

        <ul className="space-y-3">
          {tasksQuery.data?.map((task) => (
            <li
              key={task.id}
              className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between"
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
                <Badge variant={statusVariant(task.status)}>
                  {task.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild type="button" variant="outline">
                  <Link to={`/tasks/${task.id}`}>
                    Details
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <select
                  value={task.status}
                  onChange={(e) =>
                    handleUpdateTaskStatus(task.id, e.target.value as TaskStatus)
                  }
                  className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <form
          onSubmit={handleAddTask}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <Input
            className="flex-1"
            placeholder="New task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <Button
            type="submit"
            disabled={createTaskMutation.isPending || !newTaskTitle.trim()}
          >
            <Plus className="size-4" />
            Create Task
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
