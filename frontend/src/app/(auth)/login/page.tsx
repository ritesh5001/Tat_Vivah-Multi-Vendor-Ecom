"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { loginUser } from "@/services/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!identifier || !password) {
      toast.error("Enter email/phone and password to continue.");
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser({ identifier, password });

      document.cookie = `tatvivah_access=${result.accessToken}; path=/; max-age=86400`;
      document.cookie = `tatvivah_role=${result.user.role}; path=/; max-age=86400`;
      document.cookie = `tatvivah_user=${encodeURIComponent(
        JSON.stringify(result.user)
      )}; path=/; max-age=86400`;

      window.dispatchEvent(new Event("tatvivah-auth"));

      toast.success("Welcome back to TatVivah.");

      const role = result.user.role?.toUpperCase();
      const redirectMap: Record<string, string> = {
        ADMIN: "/admin/Dashboard",
        SELLER: "/seller/dashboard",
        USER: "/user/dashboard",
      };

      router.push(redirectMap[role] ?? "/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error instanceof Error ? error.message : "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-rose-50 via-white to-fuchsia-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-160px)] max-w-6xl flex-col items-center justify-center gap-10 px-6 py-16 lg:flex-row">
        {/* Left Section */}
        <div className="flex-1 space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700 dark:bg-rose-500/20 dark:text-rose-200">
            TatVivah
          </span>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back to meaningful connections.
          </h1>

          <p className="text-base text-slate-600 sm:text-lg dark:text-slate-300">
            Securely manage your journey, vendor space, or admin insights in one
            place. Sign in to continue.
          </p>

          <div className="flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span className="rounded-full border border-rose-100 bg-white px-4 py-2 dark:border-rose-500/30 dark:bg-white/5">
              Verified profiles
            </span>
          </div>
        </div>

        {/* Card */}
        <Card className="w-full max-w-md dark:border-slate-800/70 dark:bg-slate-900/70">
          <CardHeader className="space-y-2">
            <CardTitle className="dark:text-white">Sign in</CardTitle>
            <CardDescription>
              Use your TatVivah credentials to access your account.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Identifier */}
              <div className="space-y-2">
                <Label htmlFor="identifier">Email or mobile</Label>
                <Input
                  id="identifier"
                  placeholder="you@email.com or 9876543210"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="username"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <input type="checkbox" className="h-4 w-4 rounded" />
                  Remember me
                </label>
                <Link
                  href="/forgot-password"
                  className="font-medium text-rose-600 hover:text-rose-500"
                >
                  Forgot password?
                </Link>
              </div>

              <Button className="w-full" size="lg" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <Separator />

            <div className="grid gap-3">
              <Button variant="outline" size="lg">
                Continue with Google
              </Button>
              <Button variant="outline" size="lg">
                Continue with Apple
              </Button>
            </div>

            <p className="text-center text-sm text-slate-600">
              New here?{" "}
              <Link
                className="font-semibold text-rose-600 hover:text-rose-500"
                href="/register/user"
              >
                Create a user account
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
