import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getStoredToken } from "@/lib/api";

type ProtectedRouteProps = {
  requireAuth?: boolean;
};

export default function ProtectedRoute({
  requireAuth = true,
}: Readonly<ProtectedRouteProps>) {
  const location = useLocation();
  const token = getStoredToken();

  if (requireAuth && !token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!requireAuth && token) {
    const nextPath =
      typeof location.state === "object" &&
      location.state !== null &&
      "from" in location.state &&
      typeof location.state.from === "object" &&
      location.state.from !== null &&
      "pathname" in location.state.from &&
      typeof location.state.from.pathname === "string"
        ? location.state.from.pathname
        : "/";

    return <Navigate to={nextPath} replace />;
  }

  return <Outlet />;
}
