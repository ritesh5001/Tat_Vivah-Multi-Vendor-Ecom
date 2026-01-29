"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AdminProduct,
  AdminSeller,
  getAllProducts,
  getOrders,
  getPayments,
  getPendingProducts,
  getSellers,
} from "@/services/admin";
import { toast } from "sonner";

export default function AdminOverviewPage() {
  const [stats, setStats] = React.useState({
    sellers: 0,
    products: 0,
    pendingProducts: 0,
    orders: 0,
    payments: 0,
  });
  const [recentSellers, setRecentSellers] = React.useState<AdminSeller[]>([]);
  const [recentProducts, setRecentProducts] = React.useState<AdminProduct[]>([]);

  React.useEffect(() => {
    const load = async () => {
      try {
        const [sellerRes, productsRes, pendingRes, ordersRes, paymentsRes] =
          await Promise.all([
            getSellers(),
            getAllProducts(),
            getPendingProducts(),
            getOrders(),
            getPayments(),
          ]);
        setStats({
          sellers: sellerRes.sellers?.length ?? 0,
          products: productsRes.products?.length ?? 0,
          pendingProducts: pendingRes.products?.length ?? 0,
          orders: ordersRes.orders?.length ?? 0,
          payments: paymentsRes.payments?.length ?? 0,
        });
        setRecentSellers((sellerRes.sellers ?? []).slice(0, 5));
        setRecentProducts((productsRes.products ?? []).slice(0, 5));
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Unable to load admin stats"
        );
      }
    };
    load();
  }, []);

  const highlights = [
    { label: "Total sellers", value: String(stats.sellers) },
    { label: "Total products", value: String(stats.products) },
    { label: "Pending reviews", value: String(stats.pendingProducts) },
    { label: "Orders", value: String(stats.orders) },
    { label: "Payments", value: String(stats.payments) },
  ];

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
            Admin overview
          </p>
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">
            Monitor platform health and compliance.
          </h1>
          <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300">
            Review seller onboarding, merchandising metrics, and fulfillment
            signals in one place.
          </p>
        </div>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {highlights.map((item) => (
            <Card
              key={item.label}
              className="border border-emerald-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70"
            >
              <CardContent className="space-y-2 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-500">
                  {item.label}
                </p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {item.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="border border-emerald-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70 lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-lg text-slate-900 dark:text-white">
                Compliance checks
              </CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/reviews">Review all</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              {[
                "Seller KYC pending · 18",
                "Disputed products · 5",
                "Fulfillment audit items · 3",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950/60"
                >
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border border-emerald-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 dark:text-white">
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/sellers">Approve vendor</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/products">Flag listing</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/security">Send audit</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="border border-emerald-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-lg text-slate-900 dark:text-white">
                Recent sellers
              </CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/sellers">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {recentSellers.length === 0 ? (
                <p>No sellers found.</p>
              ) : (
                recentSellers.map((seller) => (
                  <div
                    key={seller.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950/60"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {seller.email ?? seller.phone ?? seller.id?.slice(0, 8)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {seller.createdAt
                          ? new Date(seller.createdAt).toLocaleDateString()
                          : "—"}
                      </p>
                    </div>
                    <span className="rounded-full border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-600 dark:border-emerald-500/40 dark:text-emerald-300">
                      {seller.status}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
          <Card className="border border-emerald-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-lg text-slate-900 dark:text-white">
                Recent products
              </CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/products">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {recentProducts.length === 0 ? (
                <p>No products found.</p>
              ) : (
                recentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950/60"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {product.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {product.categoryName ?? product.categoryId?.slice(0, 6)}
                      </p>
                    </div>
                    <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
                      {product.deletedByAdmin
                        ? "Deleted"
                        : product.isPublished
                        ? "Published"
                        : "Draft"}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
