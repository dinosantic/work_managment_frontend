import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiRequest, ApiError, setStoredToken } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  async function login() {
    setMessage("");

    try {
      const data = await apiRequest<{ token: string }>("/auth/login", {
        method: "POST",
        body: { email, password },
      });

      setStoredToken(data.token);

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

      navigate(nextPath, { replace: true });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "An error occurred";
      setMessage(`❌ ${errorMessage}`);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="mx-auto w-full max-w-2xl border-slate-200/80 bg-white/90 shadow-xl backdrop-blur">
        <CardHeader className="space-y-4">
          <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900">
            Task Management Playground
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button onClick={login} className="w-full">
            <LogIn className="size-4" />
            Login
          </Button>

          <Button
            onClick={() => navigate("/register")}
            variant="outline"
            className="w-full"
          >
            Need an account? Register
          </Button>

          {message && (
            <Alert className="border-red-200 bg-red-50 text-red-900">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
