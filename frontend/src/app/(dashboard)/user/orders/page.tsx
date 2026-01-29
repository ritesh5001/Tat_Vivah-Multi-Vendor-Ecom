"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listBuyerOrders } from "@/services/orders";
import { getPaymentDetails } from "@/services/payments";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function UserOrdersPage() {
  const [orders, setOrders] = React.useState<Array<any>>([]);
  const [loading, setLoading] = React.useState(true);
  const [paymentStatusByOrder, setPaymentStatusByOrder] = React.useState<
    Record<string, string>
  >({});

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await listBuyerOrders();
        const nextOrders = result.orders ?? [];
        setOrders(nextOrders);

        const statuses = await Promise.all(
          nextOrders.map(async (order: any) => {
            try {
              const payment = await getPaymentDetails(order.id);
              return [order.id, payment.data?.status ?? ""] as const;
            } catch {
              return [order.id, ""] as const;
            }
          })
        );

        const statusMap = statuses.reduce((acc, [orderId, status]) => {
          acc[orderId] = status;
          return acc;
        }, {} as Record<string, string>);

        setPaymentStatusByOrder(statusMap);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Unable to load orders"
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
            My orders
          </p>
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">
            Track your recent purchases.
          </h1>
        </div>

        <section className="grid gap-6">
          {loading ? (
            <p className="text-sm text-slate-500">Loading orders...</p>
          ) : orders.length === 0 ? (
            <Card className="border border-rose-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70">
              <CardContent className="p-6 text-sm text-slate-600 dark:text-slate-300">
                You have no orders yet.
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card
                key={order.id}
                className="border border-rose-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70"
              >
                {(() => {
                  const paymentStatus = paymentStatusByOrder[order.id];
                  let label = order.status;
                  if (order.status === "PLACED") {
                    if (paymentStatus === "FAILED") {
                      label = "PAYMENT FAILED";
                    } else if (paymentStatus && paymentStatus !== "SUCCESS") {
                      label = "PAYMENT PENDING";
                    }
                  }
                  return (
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="text-lg text-slate-900 dark:text-white">
                    Order {order.id.slice(0, 8).toUpperCase()}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600 dark:bg-rose-500/20 dark:text-rose-200">
                      {label}
                    </span>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/user/orders/${order.id}`}>Track</Link>
                    </Button>
                  </div>
                </CardHeader>
                  );
                })()}
                <CardContent className="grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Placed on
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Items
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {order.items?.length ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Total
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {currency.format(order.totalAmount ?? 0)}
                    </p>
                  </div>
                </CardContent>
                <CardContent className="grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Subtotal
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {currency.format(
                        (order.items ?? []).reduce(
                          (sum: number, item: any) =>
                            sum + (item.priceSnapshot ?? 0) * (item.quantity ?? 0),
                          0
                        )
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Shipping
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {currency.format(
                        Math.max(
                          (order.totalAmount ?? 0) -
                            (order.items ?? []).reduce(
                              (sum: number, item: any) =>
                                sum +
                                  (item.priceSnapshot ?? 0) *
                                    (item.quantity ?? 0),
                              0
                            ),
                          0
                        )
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Grand total
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {currency.format(order.totalAmount ?? 0)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
