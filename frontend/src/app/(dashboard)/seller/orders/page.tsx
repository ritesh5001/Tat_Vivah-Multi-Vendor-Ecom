"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listSellerOrders } from "@/services/orders";
import { toast } from "sonner";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function SellerOrdersPage() {
  const [items, setItems] = React.useState<Array<any>>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await listSellerOrders();
        setItems(result.orderItems ?? []);
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
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-indigo-50 via-white to-rose-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">
            Seller orders
          </p>
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">
            Fulfill and track incoming items.
          </h1>
        </div>

        <section className="grid gap-6">
          {loading ? (
            <p className="text-sm text-slate-500">Loading orders...</p>
          ) : items.length === 0 ? (
            <Card className="border border-indigo-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70">
              <CardContent className="p-6 text-sm text-slate-600 dark:text-slate-300">
                No orders assigned yet.
              </CardContent>
            </Card>
          ) : (
            items.map((item) => (
              <Card
                key={item.id}
                className="border border-indigo-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70"
              >
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="text-lg text-slate-900 dark:text-white">
                    {item.productTitle ?? "Order item"}
                  </CardTitle>
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                    {item.order?.status ?? "PLACED"}
                  </span>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Order
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {item.order?.id?.slice(0, 8).toUpperCase() ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Quantity
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {item.quantity}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Price
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {currency.format(item.priceSnapshot ?? 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Placed on
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {item.order?.createdAt
                        ? new Date(item.order.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "—"}
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
