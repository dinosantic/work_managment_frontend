import { useState } from "react";
import Layout from "@/components/layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "@/lib/api";
import { queryClient } from "@/lib/query-client";
import "./App.css";

type Page = "login" | "register";

export default function App() {
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [page, setPage] = useState<Page>("login");

  function handleLoggedIn(nextToken: string) {
    setStoredToken(nextToken);
    setToken(nextToken);
  }

  function handleLogout() {
    clearStoredToken();
    queryClient.clear();
    setToken(null);
    setPage("login");
  }

  if (token) {
    return <Layout onLogout={handleLogout} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="mx-auto w-full max-w-2xl border-slate-200/80 bg-white/90 shadow-xl backdrop-blur">
        <CardHeader className="space-y-4">
          <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900">
            Task Management Playground
          </CardTitle>
        </CardHeader>

        <CardContent>
          {page === "login" && (
            <LoginPage
              onLoggedIn={handleLoggedIn}
              onGoToRegister={() => setPage("register")}
            />
          )}
          {page === "register" && (
            <RegisterPage onGoToLogin={() => setPage("login")} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
