"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listBuyerOrders } from "@/services/orders";
import { toast } from "sonner";

const quickLinks = [
  { label: "Browse marketplace", href: "/marketplace" },
  { label: "Saved vendors", href: "/vendors" },
  { label: "My orders", href: "/user/orders" },
  { label: "My profile", href: "/user/profile" },
];

export default function UserDashboardPage() {
  const [user, setUser] = React.useState<{
    email?: string | null;
    phone?: string | null;
  } | null>(null);
  const [orders, setOrders] = React.useState<
    Array<{ id: string; status: string; item: string }>
  >([]);

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

  React.useEffect(() => {
    const loadOrders = async () => {
      try {
        const result = await listBuyerOrders();
        const mapped = (result.orders ?? []).slice(0, 3).map((order) => ({
          id: order.id,
          status: order.status,
          item: `Order ${order.id.slice(0, 6).toUpperCase()}`,
        }));
        setOrders(mapped);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Unable to load orders"
        );
      }
    };
    loadOrders();
  }, []);

  const displayName = user?.email ?? user?.phone ?? "Customer";

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
            User dashboard
          </p>
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">
            Welcome, {displayName}
          </h1>
          <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300">
            Track your orders, manage saved items, and discover new collections.
          </p>
        </div>

        <section className="grid gap-6 sm:grid-cols-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border border-rose-100 bg-white/80 px-4 py-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-1 hover:border-rose-200 hover:text-rose-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200"
            >
              {link.label}
            </Link>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="border border-rose-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 dark:text-white">
                Recent orders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orders.length === 0 ? (
                <p className="text-sm text-slate-500">No recent orders yet.</p>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {order.item}
                      </p>
                      <p className="text-xs">{order.id}</p>
                    </div>
                    <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600 dark:bg-rose-500/20 dark:text-rose-200">
                      {order.status}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border border-rose-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 dark:text-white">
                Quick actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full">
                Track order
              </Button>
              <Button variant="outline" className="w-full">
                Request support
              </Button>
              <Button className="w-full">Shop now</Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
