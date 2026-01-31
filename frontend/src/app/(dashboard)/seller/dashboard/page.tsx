"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { listSellerOrders } from "@/services/orders";
import { toast } from "sonner";

const stats = [
  { label: "New Inquiries", value: "92", description: "This month" },
  { label: "Active Orders", value: "64", description: "In progress" },
  { label: "Monthly Revenue", value: "₹12.4L", description: "Current period" },
  { label: "Seller Rating", value: "4.8", description: "Verified reviews" },
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
    <div className="min-h-[calc(100vh-160px)] bg-background">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 lg:py-20"
      >
        {/* Header */}
        <div className="space-y-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-gold">
            Seller Console
          </p>
          <h1 className="font-serif text-4xl font-light tracking-tight text-foreground sm:text-5xl">
            Business Overview
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Track orders, manage inventory, and maintain performance across your fashion listings.
          </p>
        </div>

        {/* Stats Grid - Business Insights */}
        <section className="grid gap-px bg-border-soft sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05, duration: 0.5 }}
              className="bg-card p-6 lg:p-8 space-y-4"
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold">
                {stat.label}
              </p>
              <div className="space-y-1">
                <p className="font-serif text-3xl font-light text-foreground">
                  {stat.value}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Main Content */}
        <section className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="border border-border-soft bg-card"
          >
            <div className="flex items-center justify-between border-b border-border-soft p-6">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1">
                  Recent Orders
                </p>
                <p className="text-sm text-muted-foreground">
                  Latest customer orders requiring attention
                </p>
              </div>
              <Link href="/seller/orders">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>

            <div className="divide-y divide-border-soft">
              {orders.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No recent orders yet.
                  </p>
                </div>
              ) : (
                orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.05, duration: 0.4 }}
                    className="flex items-center justify-between gap-4 p-6"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">
                        {order.customer}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.date}
                      </p>
                    </div>
                    <span className="px-3 py-1 text-[10px] font-medium uppercase tracking-wider border border-border-soft text-muted-foreground">
                      {order.status}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="border border-border-soft bg-card h-fit"
          >
            <div className="border-b border-border-soft p-6">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1">
                Quick Actions
              </p>
              <p className="text-sm text-muted-foreground">
                Common seller operations
              </p>
            </div>

            <div className="p-6 space-y-3">
              {[
                { label: "Add New Listing", href: "/seller/products" },
                { label: "Manage Orders", href: "/seller/orders" },
                { label: "Update Profile", href: "/seller/profile" },
              ].map((action) => (
                <Link key={action.label} href={action.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex items-center justify-between py-3 px-4 border border-border-soft text-sm text-foreground transition-all duration-300 hover:border-gold/50 hover:bg-cream/50 dark:hover:bg-brown/20"
                  >
                    <span>{action.label}</span>
                    <span className="text-muted-foreground">→</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Trust Footer */}
        <section className="border-t border-border-soft pt-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-gold" />
              Seller Protection
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-gold" />
              Secure Payouts
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-gold" />
              Dedicated Support
            </span>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
