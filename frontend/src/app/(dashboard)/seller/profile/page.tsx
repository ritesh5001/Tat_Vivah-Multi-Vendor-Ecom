"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SellerProfilePage() {
  const [user, setUser] = React.useState<{
    email?: string | null;
    phone?: string | null;
    role?: string | null;
    status?: string | null;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
  } | null>(null);

  React.useEffect(() => {
    const match = document.cookie.match(/(?:^|; )tatvivah_user=([^;]*)/);
    if (match) {
      try {
        setUser(JSON.parse(decodeURIComponent(match[1])));
      } catch {
        setUser(null);
      }
    }
  }, []);

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-indigo-50 via-white to-rose-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">
            Seller profile
          </p>
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">
            Business account overview
          </h1>
          <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300">
            Manage your seller identity, verification, and payout preferences.
          </p>
        </div>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="border border-indigo-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 dark:text-white">
                Account details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950/60">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Email
                </p>
                <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                  {user?.email ?? "—"}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950/60">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Phone
                </p>
                <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                  {user?.phone ?? "—"}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950/60">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Role
                </p>
                <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                  {user?.role ?? "—"}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950/60">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Status
                </p>
                <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                  {user?.status ?? "—"}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950/60">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Email verified
                </p>
                <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                  {user?.isEmailVerified ? "Verified" : "Not verified"}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950/60">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Phone verified
                </p>
                <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                  {user?.isPhoneVerified ? "Verified" : "Not verified"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-indigo-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 dark:text-white">
                Seller tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full">
                Update payout details
              </Button>
              <Button variant="outline" className="w-full">
                Manage store profile
              </Button>
              <Button className="w-full">Contact seller support</Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
