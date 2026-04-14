import { useEffect, useMemo, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ApiError } from "@/lib/api";
import { useCurrentUser } from "@/features/user/hooks";
import HomePage from "@/pages/HomePage";
import ProfilePage from "@/pages/ProfilePage";
import TasksPage from "@/pages/TasksPage";

export type DashboardSection = "overview" | "tasks" | "profile";

type LayoutProps = {
  onLogout: () => void;
};

const sectionTitles: Record<DashboardSection, string> = {
  overview: "Overview",
  tasks: "Tasks",
  profile: "Profile",
};

export default function Layout({ onLogout }: Readonly<LayoutProps>) {
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("overview");

  const { currentUserQuery } = useCurrentUser();

  useEffect(() => {
    if (
      currentUserQuery.error instanceof ApiError &&
      currentUserQuery.error.status === 401
    ) {
      onLogout();
    }
  }, [currentUserQuery.error, onLogout]);

  const sectionTitle = useMemo(
    () => sectionTitles[activeSection],
    [activeSection],
  );

  if (
    currentUserQuery.error instanceof ApiError &&
    currentUserQuery.error.status === 401
  ) {
    return null;
  }

  if (currentUserQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,_#fff7ed_0%,_#f8fafc_20%,_#e2e8f0_100%)] px-4">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
          <LoaderCircle className="size-4 animate-spin" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!currentUserQuery.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,_#fff7ed_0%,_#f8fafc_20%,_#e2e8f0_100%)] px-4">
        <Alert className="max-w-md border-red-200 bg-white text-red-900 shadow-sm">
          <AlertTitle>Could not start dashboard</AlertTitle>
          <AlertDescription>
            {currentUserQuery.error instanceof ApiError
              ? currentUserQuery.error.message
              : "Unexpected error"}
          </AlertDescription>
          <div className="mt-4 flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => currentUserQuery.refetch()}
            >
              Retry
            </Button>
            <Button type="button" variant="destructive" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-[linear-gradient(180deg,_#fff7ed_0%,_#f8fafc_20%,_#e2e8f0_100%)]">
        <AppSidebar
          activeSection={activeSection}
          currentUser={currentUserQuery.data}
          onLogout={onLogout}
          onSectionChange={setActiveSection}
        />

        <SidebarInset>
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
                    Task Management Playground
                  </p>
                  <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                    {sectionTitle}
                  </h1>
                </div>
              </div>
              <Badge variant="outline">{currentUserQuery.data.role}</Badge>
            </div>
          </header>

          <main className="flex-1 p-4">
            {activeSection === "overview" && (
              <HomePage
                currentUser={currentUserQuery.data}
                isLoadingUser={false}
                userError={null}
              />
            )}
            {activeSection === "tasks" && <TasksPage />}
            {activeSection === "profile" && (
              <ProfilePage user={currentUserQuery.data} />
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
