"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listSellerOrders } from "@/services/orders";
import {
  createShipment,
  listSellerShipments,
  markShipmentDelivered,
  markShipmentShipped,
} from "@/services/shipments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function SellerOrdersPage() {
  const [items, setItems] = React.useState<Array<any>>([]);
  const [loading, setLoading] = React.useState(true);
  const [shipmentsByOrder, setShipmentsByOrder] = React.useState<
    Record<string, Array<any>>
  >({});
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [shipmentForm, setShipmentForm] = React.useState<
    Record<string, { carrier: string; trackingNumber: string }>
  >({});

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [ordersResult, shipmentsResult] = await Promise.all([
          listSellerOrders(),
          listSellerShipments(),
        ]);

        setItems(ordersResult.orderItems ?? []);

        const shipments = shipmentsResult.data?.shipments ?? [];
        const grouped = shipments.reduce((acc, shipment) => {
          const orderId = shipment.orderId;
          acc[orderId] = acc[orderId] ? [...acc[orderId], shipment] : [shipment];
          return acc;
        }, {} as Record<string, Array<any>>);
        setShipmentsByOrder(grouped);
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

  const filteredItems = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      const orderStatus = item.order?.status ?? "";
      if (statusFilter !== "ALL" && orderStatus !== statusFilter) {
        return false;
      }

      if (!query) return true;

      const shipment = shipmentsByOrder[item.order?.id ?? ""]?.[0];
      const haystack = [
        item.productTitle,
        item.variantSku,
        item.order?.id,
        item.order?.shippingName,
        item.order?.shippingPhone,
        item.order?.shippingEmail,
        item.order?.shippingAddressLine1,
        item.order?.shippingAddressLine2,
        item.order?.shippingCity,
        shipment?.trackingNumber,
        shipment?.carrier,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [items, searchQuery, statusFilter, shipmentsByOrder]);

  const handleCreateShipment = async (orderId: string) => {
    const payload = shipmentForm[orderId];
    if (!payload?.carrier || !payload?.trackingNumber) {
      toast.error("Enter carrier and tracking number.");
      return;
    }
    try {
      const result = await createShipment(orderId, payload);
      toast.success("Shipment created.");
      setShipmentForm((prev) => ({
        ...prev,
        [orderId]: { carrier: "", trackingNumber: "" },
      }));
      setShipmentsByOrder((prev) => ({
        ...prev,
        [orderId]: [result.data],
      }));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to create shipment"
      );
    }
  };

  const handleMarkShipped = async (shipmentId: string, orderId: string) => {
    try {
      const result = await markShipmentShipped(shipmentId);
      toast.success("Marked as shipped.");
      setShipmentsByOrder((prev) => ({
        ...prev,
        [orderId]: [result.data],
      }));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update shipment"
      );
    }
  };

  const handleMarkDelivered = async (shipmentId: string, orderId: string) => {
    try {
      const result = await markShipmentDelivered(shipmentId);
      toast.success("Marked as delivered.");
      setShipmentsByOrder((prev) => ({
        ...prev,
        [orderId]: [result.data],
      }));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update shipment"
      );
    }
  };

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

        <div className="flex flex-col gap-3 rounded-2xl border border-indigo-100/70 bg-white/80 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 md:flex-row md:items-center md:justify-between">
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search orders, customer, tracking"
            className="md:max-w-md"
          />
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Status
            </label>
            <select
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-indigo-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="ALL">All</option>
              <option value="PLACED">Placed</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <section className="grid gap-6">
          {loading ? (
            <p className="text-sm text-slate-500">Loading orders...</p>
          ) : filteredItems.length === 0 ? (
            <Card className="border border-indigo-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70">
              <CardContent className="p-6 text-sm text-slate-600 dark:text-slate-300">
                No orders assigned yet.
              </CardContent>
            </Card>
          ) : (
            filteredItems.map((item) => {
              const orderId = item.order?.id as string;
              const shipment = shipmentsByOrder[orderId]?.[0];
              return (
              <Card
                key={item.id}
                className="border border-indigo-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70"
              >
                <CardContent className="grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Ship to
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {item.order?.shippingName ?? "—"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.order?.shippingPhone ?? ""}
                      {item.order?.shippingEmail
                        ? ` · ${item.order.shippingEmail}`
                        : ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Address
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {item.order?.shippingAddressLine1 ?? "—"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.order?.shippingAddressLine2 ?? ""}
                      {item.order?.shippingCity
                        ? `, ${item.order.shippingCity}`
                        : ""}
                    </p>
                  </div>
                  {item.order?.shippingNotes ? (
                    <div className="sm:col-span-2">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Notes
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {item.order.shippingNotes}
                      </p>
                    </div>
                  ) : null}
                </CardContent>
                <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Shipment status
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {item.productTitle ?? "Order item"}
                      </p>
                      <p className="text-xs text-slate-500">
                        SKU: {item.variantSku ?? "—"} · Qty {item.quantity}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {item.order?.status ?? "PLACED"}
                    </span>
                  </div>
                  {shipment ? (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950/60">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {shipment.carrier} · {shipment.trackingNumber}
                        </p>
                        <p className="text-xs text-slate-500">
                          Status: {shipment.status}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {shipment.status === "CREATED" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkShipped(shipment.id, orderId)}
                          >
                            Mark shipped
                          </Button>
                        ) : null}
                        {shipment.status === "SHIPPED" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkDelivered(shipment.id, orderId)}
                          >
                            Mark delivered
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Input
                        placeholder="Carrier"
                        value={shipmentForm[orderId]?.carrier ?? ""}
                        onChange={(event) =>
                          setShipmentForm((prev) => ({
                            ...prev,
                            [orderId]: {
                              carrier: event.target.value,
                              trackingNumber: prev[orderId]?.trackingNumber ?? "",
                            },
                          }))
                        }
                      />
                      <Input
                        placeholder="Tracking number"
                        value={shipmentForm[orderId]?.trackingNumber ?? ""}
                        onChange={(event) =>
                          setShipmentForm((prev) => ({
                            ...prev,
                            [orderId]: {
                              carrier: prev[orderId]?.carrier ?? "",
                              trackingNumber: event.target.value,
                            },
                          }))
                        }
                      />
                      <Button onClick={() => handleCreateShipment(orderId)}>
                        Create shipment
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
          )}
        </section>
      </div>
    </div>
  );
}
