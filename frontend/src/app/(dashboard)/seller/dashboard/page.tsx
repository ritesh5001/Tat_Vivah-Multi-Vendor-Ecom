"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listSellerOrders } from "@/services/orders";
import { toast } from "sonner";

const stats = [
  { label: "New inquiries", value: "92" },
  { label: "Active orders", value: "64" },
  { label: "Monthly revenue", value: "₹12.4L" },
  { label: "Rating", value: "4.8" },
];

export default function SellerDashboardPage() {
  const [orders, setOrders] = React.useState<
    Array<{ id: string; customer: string; date: string; status: string }>
  >([]);

  React.useEffect(() => {
    const loadOrders = async () => {
      try {
        const result = await listSellerOrders();
        const mapped = (result.orderItems ?? []).slice(0, 3).map((item) => ({
          id: item.order?.id ?? item.orderId,
          customer: item.productTitle ?? "Order item",
          date: item.order?.createdAt
            ? new Date(item.order.createdAt).toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "—",
          status: item.order?.status ?? "PLACED",
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

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-indigo-50 via-white to-rose-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">
            Seller console
          </p>
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">
            Manage your multi-vendor business.
          </h1>
          <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300">
            Track apparel orders, manage inventory, and keep performance high
            across every listing.
          </p>
        </div>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="border border-indigo-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70"
            >
              <CardContent className="space-y-2 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-indigo-500">
                  {stat.label}
                </p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="border border-indigo-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70 lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-lg text-slate-900 dark:text-white">
                Recent orders
              </CardTitle>
              <Button variant="outline" size="sm">
                View all
              </Button>
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
                        {order.customer}
                      </p>
                      <p className="text-xs">{order.date}</p>
                    </div>
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                      {order.status}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border border-indigo-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 dark:text-white">
                Quick actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {["Add new listing", "Update pricing", "Schedule review"].map(
                (item) => (
                  <Button key={item} variant="outline" className="w-full">
                    {item}
                  </Button>
                )
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
