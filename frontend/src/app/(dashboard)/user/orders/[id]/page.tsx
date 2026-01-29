"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrderTracking } from "@/services/shipments";
import { toast } from "sonner";

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [loading, setLoading] = React.useState(true);
  const [tracking, setTracking] = React.useState<{
    orderId: string;
    status: string;
    shipments: Array<{
      id: string;
      carrier: string;
      trackingNumber: string;
      status: string;
      shippedAt?: string | null;
      deliveredAt?: string | null;
      events: Array<{ status: string; note?: string | null; createdAt: string }>;
    }>;
  } | null>(null);

  React.useEffect(() => {
    const load = async () => {
      if (!orderId) return;
      setLoading(true);
      try {
        const result = await getOrderTracking(orderId);
        setTracking(result.data ?? null);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Unable to load tracking"
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [orderId]);

  if (!orderId) {
    return (
      <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-16">
          <Card className="border border-rose-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70">
            <CardContent className="p-6 text-sm text-slate-600 dark:text-slate-300">
              Order not found.
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
              Order tracking
            </p>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
              Track order {orderId.slice(0, 8).toUpperCase()}
            </h1>
          </div>
          <Button variant="outline" onClick={() => router.push("/user/orders")}
          >
            Back to orders
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading tracking...</p>
        ) : !tracking ? (
          <Card className="border border-rose-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70">
            <CardContent className="p-6 text-sm text-slate-600 dark:text-slate-300">
              Tracking details unavailable.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            <Card className="border border-rose-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900 dark:text-white">
                  Current status
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 dark:text-slate-300">
                Order status: <span className="font-semibold text-slate-900 dark:text-white">{tracking.status}</span>
              </CardContent>
            </Card>

            {tracking.shipments.length === 0 ? (
              <Card className="border border-rose-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70">
                <CardContent className="p-6 text-sm text-slate-600 dark:text-slate-300">
                  Shipment not created yet.
                </CardContent>
              </Card>
            ) : (
              tracking.shipments.map((shipment) => (
                <Card
                  key={shipment.id}
                  className="border border-rose-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70"
                >
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-900 dark:text-white">
                      {shipment.carrier} · {shipment.trackingNumber}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600 dark:bg-rose-500/20 dark:text-rose-200">
                        {shipment.status}
                      </span>
                      <span className="text-xs text-slate-500">
                        {shipment.shippedAt
                          ? `Shipped ${new Date(shipment.shippedAt).toLocaleDateString("en-IN")}`
                          : shipment.deliveredAt
                          ? `Delivered ${new Date(shipment.deliveredAt).toLocaleDateString("en-IN")}`
                          : ""}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Timeline
                      </p>
                      {shipment.events.length === 0 ? (
                        <p className="text-sm text-slate-500">No events yet.</p>
                      ) : (
                        <ul className="space-y-2">
                          {shipment.events.map((event, index) => (
                            <li
                              key={`${shipment.id}-${index}`}
                              className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950/60"
                            >
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {event.status}
                              </p>
                              <p className="text-xs text-slate-500">
                                {new Date(event.createdAt).toLocaleString("en-IN")}
                              </p>
                              {event.note ? (
                                <p className="text-xs text-slate-500">{event.note}</p>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
