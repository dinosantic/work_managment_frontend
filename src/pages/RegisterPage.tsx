import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type RegisterPageProps = {
  apiUrl: string;
  onGoToLogin: () => void;
};

export default function RegisterPage({
  apiUrl,
  onGoToLogin,
}: RegisterPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function register() {
    setMessage("");

    try {
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error");
      }

      setMessage(data.message || "User registered");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
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
        onClick={register}
        className="w-full"
      >
        <UserPlus className="size-4" />
        Register
      </Button>

      <Button
        onClick={onGoToLogin}
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
    </div>
  );
}
