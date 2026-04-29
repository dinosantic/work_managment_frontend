import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FolderKanban, Plus, Users } from "lucide-react";
import { Link } from "react-router-dom";
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
import { Textarea } from "@/components/ui/textarea";
import { useProjects } from "@/features/projects/hooks";
import { createProjectSchema } from "@/features/projects/schemas";
import type { CreateProjectValues } from "@/features/projects/types";

export default function ProjectsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { projectsQuery, createProjectMutation } = useProjects();
  const form = useForm<CreateProjectValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function handleCreateProject(values: CreateProjectValues) {
    await createProjectMutation.mutateAsync(values);
    form.reset();
    setIsCreateDialogOpen(false);
  }

  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-xl">
            <FolderKanban className="size-5 text-slate-700" />
            Projects
          </CardTitle>
          <p className="text-sm text-slate-500">
            Organize work by project and manage members in project context.
          </p>
        </div>
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
              Create project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create project</DialogTitle>
              <DialogDescription>
                Start a new project before inviting members or creating tasks.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={form.handleSubmit(handleCreateProject)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Name
                </label>
                <Input {...form.register("name")} placeholder="Project name" />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Description
                </label>
                <Textarea
                  {...form.register("description")}
                  placeholder="What is this project for?"
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.description.message}
                  </p>
                )}
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
                <Button
                  type="submit"
                  disabled={createProjectMutation.isPending}
                >
                  <Plus className="size-4" />
                  Create project
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {projectsQuery.isLoading && (
          <p className="text-sm text-slate-500">Loading projects...</p>
        )}
        {!projectsQuery.isLoading && !projectsQuery.data?.length && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
            <p className="text-sm text-slate-600">
              No projects yet. Create your first project to start organizing
              team work.
            </p>
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projectsQuery.data?.map((project) => (
            <Card key={project.id} className="border-slate-200 bg-slate-50">
              <CardHeader className="space-y-3">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                  <Users className="size-3.5" />
                  Project space
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-900">
                    {project.name}
                  </CardTitle>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                    {project.description || "No description provided."}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </p>
                <Button asChild variant="outline">
                  <Link to={`/projects/${project.id}`}>Open</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
