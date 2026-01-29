"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { approveProduct, getPendingProducts, rejectProduct } from "@/services/admin";
import { toast } from "sonner";

export default function AdminReviewsPage() {
  const [loading, setLoading] = React.useState(true);
  const [products, setProducts] = React.useState<Array<any>>([]);
  const [reasons, setReasons] = React.useState<Record<string, string>>({});

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const result = await getPendingProducts();
      setProducts(result.products ?? []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load pending products"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleApprove = async (id: string) => {
    try {
      await approveProduct(id);
      toast.success("Product approved.");
      load();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to approve product"
      );
    }
  };

  const handleReject = async (id: string) => {
    const reason = reasons[id] ?? "";
    if (!reason.trim()) {
      toast.error("Add a rejection reason.");
      return;
    }
    try {
      await rejectProduct(id, reason);
      toast.success("Product rejected.");
      setReasons((prev) => ({ ...prev, [id]: "" }));
      load();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to reject product"
      );
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
            Product moderation
          </p>
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">
            Approve or reject pending products.
          </h1>
        </div>

        <section className="grid gap-6">
          {loading ? (
            <p className="text-sm text-slate-500">Loading products...</p>
          ) : products.length === 0 ? (
            <Card className="border border-emerald-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70">
              <CardContent className="p-6 text-sm text-slate-600 dark:text-slate-300">
                No products pending moderation.
              </CardContent>
            </Card>
          ) : (
            products.map((product) => (
              <Card
                key={product.id}
                className="border border-emerald-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70"
              >
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="text-lg text-slate-900 dark:text-white">
                    {product.title}
                  </CardTitle>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                    {product.moderation?.status ?? "PENDING"}
                  </span>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <Input
                    placeholder="Reason for rejection"
                    value={reasons[product.id] ?? ""}
                    onChange={(event) =>
                      setReasons((prev) => ({
                        ...prev,
                        [product.id]: event.target.value,
                      }))
                    }
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleApprove(product.id)}>
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleReject(product.id)}>
                      Reject
                    </Button>
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
