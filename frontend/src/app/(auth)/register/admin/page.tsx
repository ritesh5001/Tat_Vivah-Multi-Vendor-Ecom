"use client";

import * as React from "react";
import Link from "next/link";
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
import { toast } from "sonner";
import { registerAdmin } from "@/services/auth";

export default function AdminRegisterPage() {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [designation, setDesignation] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!firstName || !lastName || !email || !password) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await registerAdmin({
        firstName,
        lastName,
        email,
        password,
        phone: phone || undefined,
        department: department || undefined,
        designation: designation || undefined,
      });
      toast.success("Admin account created. Please sign in.");
      window.location.href = "/login";
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-160px)] max-w-6xl flex-col items-center justify-center gap-10 px-6 py-16 lg:flex-row">
        <div className="flex-1 space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
            Admin Registration
          </span>
          <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl dark:text-white">
            Securely manage TatVivah operations.
          </h1>
          <p className="text-base text-slate-600 sm:text-lg dark:text-slate-300">
            Set up admin access with verification steps and enforce governance
            policies across the platform.
          </p>
          <div className="space-y-4 rounded-3xl border border-emerald-100 bg-white p-6 text-sm text-slate-600 shadow-sm dark:border-emerald-500/30 dark:bg-white/5 dark:text-slate-300">
            <div className="flex items-center justify-between">
              <span>Access level</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                Super admin
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Security audit</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                Mandatory
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Compliance review</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                Required
              </span>
            </div>
          </div>
        </div>
        <Card className="w-full max-w-md dark:border-slate-800/70 dark:bg-slate-900/70">
          <CardHeader className="space-y-2">
            <CardTitle className="dark:text-white">Provision admin account</CardTitle>
            <CardDescription>
              Restricted access. Use the official verification details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="dark:text-slate-200">
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Aditi"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="dark:text-slate-200">
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Mehta"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-slate-200">
                  Work email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@tatvivah.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="dark:text-slate-200">
                  Contact number (optional)
                </Label>
                <Input
                  id="phone"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="department" className="dark:text-slate-200">
                    Department (optional)
                  </Label>
                  <Input
                    id="department"
                    placeholder="Operations"
                    value={department}
                    onChange={(event) => setDepartment(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation" className="dark:text-slate-200">
                    Designation (optional)
                  </Label>
                  <Input
                    id="designation"
                    placeholder="Compliance lead"
                    value={designation}
                    onChange={(event) => setDesignation(event.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password" className="dark:text-slate-200">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 8 chars, 1 uppercase, 1 number"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm" className="dark:text-slate-200">
                    Confirm password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
              <Button className="w-full" size="lg" type="submit" disabled={loading}>
                {loading ? "Creating admin..." : "Request admin access"}
              </Button>
            </form>
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              Already authorized?{" "}
              <Link
                className="font-semibold text-emerald-600 hover:text-emerald-500"
                href="/login"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
