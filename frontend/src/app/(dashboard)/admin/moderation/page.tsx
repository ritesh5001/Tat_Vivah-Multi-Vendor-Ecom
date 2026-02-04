"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { approveProduct, getPendingProducts, rejectProduct } from "@/services/admin";
import { toast } from "sonner";

export default function AdminModerationPage() {
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
    <div className="min-h-[calc(100vh-160px)] bg-background">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 lg:py-20"
      >
        {/* Header */}
        <div className="space-y-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-gold">
            Product Moderation
          </p>
          <h1 className="font-serif text-4xl font-light tracking-tight text-foreground sm:text-5xl">
            Compliance Reviews
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Approve or reject products pending moderation with deliberate oversight.
          </p>
        </div>

        {/* Pending Products */}
        <section className="space-y-6">
          {loading ? (
            <div className="border border-border-soft bg-card p-12 text-center">
              <p className="text-sm text-muted-foreground">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="border border-border-soft bg-card p-12 text-center space-y-2">
              <p className="font-serif text-lg font-light text-foreground">
                All Clear
              </p>
              <p className="text-sm text-muted-foreground">
                No products pending moderation.
              </p>
            </div>
          ) : (
            products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.5 }}
                className="border border-border-soft bg-card"
              >
                {/* Product Header */}
                <div className="flex items-center justify-between gap-4 p-6 border-b border-border-soft">
                  <div className="space-y-1">
                    <p className="font-serif text-lg font-normal text-foreground">
                      {product.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.categoryName ?? "Uncategorized"} · Seller: {product.sellerEmail ?? product.sellerId?.slice(0, 8)}
                    </p>
                  </div>
                  <span className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider border border-[#B8956C]/30 text-[#8A7054] bg-[#B8956C]/5">
                    {product.moderation?.status ?? "PENDING"}
                  </span>
                </div>

                {/* Action Area */}
                <div className="p-6 space-y-4">
                  <Input
                    placeholder="Reason for rejection (required to reject)"
                    value={reasons[product.id] ?? ""}
                    onChange={(event) =>
                      setReasons((prev) => ({
                        ...prev,
                        [product.id]: event.target.value,
                      }))
                    }
                    className="h-12"
                  />
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(product.id)}
                      className="h-10 px-6"
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(product.id)}
                      className="h-10 px-6 text-muted-foreground hover:text-[#7A5656] hover:border-[#A67575]/40"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </section>
      </motion.div>
    </div>
  );
}
