import { Suspense, lazy, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";
import SuspenseFallback from "@/routes/SuspenseFallback";

const Layout = lazy(() => import("@/components/layout"));
const HomePage = lazy(() => import("@/pages/HomePage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const ProjectDetailsPage = lazy(() => import("@/pages/ProjectDetailsPage"));
const ProjectsPage = lazy(() => import("@/pages/ProjectsPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const TaskDetailsPage = lazy(() => import("@/pages/TaskDetailsPage"));
const TasksPage = lazy(() => import("@/pages/TasksPage"));

function withSuspense(node: ReactNode) {
  return <Suspense fallback={<SuspenseFallback />}>{node}</Suspense>;
}

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute requireAuth={false} />,
    children: [
      {
        path: "/login",
        element: withSuspense(<LoginPage />),
      },
      {
        path: "/register",
        element: withSuspense(<RegisterPage />),
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: withSuspense(<Layout />),
        children: [
          {
            index: true,
            element: withSuspense(<HomePage />),
          },
          {
            path: "projects",
            element: withSuspense(<ProjectsPage />),
          },
          {
            path: "projects/:projectId",
            element: withSuspense(<ProjectDetailsPage />),
          },
          {
            path: "tasks",
            element: withSuspense(<TasksPage />),
          },
          {
            path: "tasks/:taskId",
            element: withSuspense(<TaskDetailsPage />),
          },
          {
            path: "profile",
            element: withSuspense(<ProfilePage />),
          },
        ],
      },
    ],
  },
]);
