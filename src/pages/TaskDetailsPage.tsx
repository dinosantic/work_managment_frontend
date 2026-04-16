import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ListTodo } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTaskQuery } from "@/features/tasks/hooks";
import type { TaskStatus } from "@/features/tasks/types";
import { ApiError } from "@/lib/api";

function statusVariant(status: TaskStatus) {
  if (status === "DONE") return "success" as const;
  if (status === "IN_PROGRESS") return "warning" as const;
  return "muted" as const;
}

export default function TaskDetailsPage() {
  const { taskId } = useParams();
  const parsedTaskId = Number(taskId);

  const taskQuery = useTaskQuery(parsedTaskId);

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

  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <Button asChild variant="ghost" className="-ml-3 w-fit px-3 text-slate-500">
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
        <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            Task ID
          </p>
          <p className="mt-2 text-sm font-medium text-slate-900">{task.id}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            Status
          </p>
          <p className="mt-2 text-sm font-medium text-slate-900">
            {task.status}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
