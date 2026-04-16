import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiRequest, ApiError } from "@/lib/api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function register() {
    setMessage("");

    try {
      const data = await apiRequest<{ message?: string }>("/auth/register", {
        method: "POST",
        body: { email, password },
      });

      setMessage(data.message || "User registered");
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

          <Button onClick={register} className="w-full">
            <UserPlus className="size-4" />
            Register
          </Button>

          <Button
            onClick={() => navigate("/login")}
            variant="outline"
            className="w-full"
          >
            Already have an account? Login
          </Button>

          {message && (
            <Alert
              className={
                message.startsWith("❌")
                  ? "border-red-200 bg-red-50 text-red-900"
                  : "border-emerald-200 bg-emerald-50 text-emerald-900"
              }
            >
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
