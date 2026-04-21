import { useCallback, useEffect, useMemo } from "react";
import { LoaderCircle } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { queryClient } from "@/lib/query-client";
import { ApiError, clearStoredToken } from "@/lib/api";
import { useCurrentUser } from "@/features/user/hooks";
import { sectionTitles } from "@/lib/utils";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const { currentUserQuery } = useCurrentUser();

  const handleLogout = useCallback(() => {
    clearStoredToken();
    queryClient.clear();
    navigate("/login", { replace: true });
  }, [navigate]);

  useEffect(() => {
    if (
      currentUserQuery.error instanceof ApiError &&
      currentUserQuery.error.status === 401
    ) {
      handleLogout();
    }
  }, [currentUserQuery.error, handleLogout]);

  const sectionTitle = useMemo(
    () =>
      sectionTitles.find(({ match }) => match.test(location.pathname))?.title ??
      "Dashboard",
    [location.pathname],
  );

  if (
    currentUserQuery.error instanceof ApiError &&
    currentUserQuery.error.status === 401
  ) {
    return null;
  }

  if (currentUserQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
          <LoaderCircle className="size-4 animate-spin" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!currentUserQuery.data) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
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
            <Button type="button" variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <AppSidebar
          currentUser={currentUserQuery.data}
          onLogout={handleLogout}
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
            </div>
          </header>

          <main className="flex-1 p-4">
            <Outlet context={{ currentUser: currentUserQuery.data }} />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
