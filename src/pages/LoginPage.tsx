import { useState } from "react";
import { LogIn } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest, ApiError } from "@/lib/api";

type LoginPageProps = {
  onLoggedIn: (token: string) => void;
  onGoToRegister: () => void;
};

export default function LoginPage({
  onLoggedIn,
  onGoToRegister,
}: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function login() {
    setMessage("");

    try {
      const data = await apiRequest<{ token: string }>("/auth/login", {
        method: "POST",
        body: { email, password },
      });

      onLoggedIn(data.token);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "An error occurred";
      setMessage(`❌ ${errorMessage}`);
    }
  }

  return (
    <div className="space-y-4">
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

      <Button
        onClick={login}
        className="w-full"
      >
        <LogIn className="size-4" />
        Login
      </Button>

      <Button
        onClick={onGoToRegister}
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
    </div>
  );
}
