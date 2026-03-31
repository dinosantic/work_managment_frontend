import { useState } from "react";
import Layout from "@/components/layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { queryClient } from "@/lib/query-client";
import "./App.css";

const API_URL = "http://localhost:3000";

type Page = "login" | "register";

export default function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [page, setPage] = useState<Page>("login");

  function handleLoggedIn(nextToken: string) {
    localStorage.setItem("token", nextToken);
    setToken(nextToken);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    queryClient.clear();
    setToken(null);
    setPage("login");
  }

  if (token) {
    return <Layout apiUrl={API_URL} token={token} onLogout={handleLogout} />;
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
              apiUrl={API_URL}
              onLoggedIn={handleLoggedIn}
              onGoToRegister={() => setPage("register")}
            />
          )}
          {page === "register" && (
            <RegisterPage
              apiUrl={API_URL}
              onGoToLogin={() => setPage("login")}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
