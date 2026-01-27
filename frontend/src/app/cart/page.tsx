"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCart, removeCartItem, updateCartItem } from "@/services/cart";
import { toast } from "sonner";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function CartPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [cart, setCart] = React.useState<
    { items: Array<any> } | null
  >(null);

  const loadCart = React.useCallback(async () => {
    setLoading(true);
    try {
      const result = await getCart();
      setCart(result.cart);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load cart");
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleQuantity = async (itemId: string, nextQty: number) => {
    if (nextQty <= 0) {
      await handleRemove(itemId);
      return;
    }
    try {
      await updateCartItem(itemId, nextQty);
      await loadCart();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      await removeCartItem(itemId);
      await loadCart();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Remove failed");
    }
  };

  const items = cart?.items ?? [];
  const subtotal = items.reduce(
    (sum, item) => sum + item.priceSnapshot * item.quantity,
    0
  );
  const shipping = items.length > 0 ? 180 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
            Your cart
          </p>
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">
            Review selected items
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border border-rose-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 dark:text-white">
                Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <p className="text-sm text-slate-500">Loading cart...</p>
              ) : items.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Your cart is empty. Start shopping.
                </p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {item.product?.title ?? "Item"}
                        </p>
                        <p className="text-xs">SKU · {item.variant?.sku ?? "—"}</p>
                      </div>
                      <p className="text-base font-semibold text-rose-600">
                        {currency.format(item.priceSnapshot)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="min-w-[2rem] text-center font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemove(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border border-rose-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 dark:text-white">
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{currency.format(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>{items.length > 0 ? currency.format(shipping) : "₹0"}</span>
              </div>
              <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                <span>Total</span>
                <span>{currency.format(total)}</span>
              </div>
              <Button size="lg" className="w-full" onClick={() => router.push("/checkout")}>
                Proceed to checkout
              </Button>
              <Link
                href="/marketplace"
                className="text-center text-sm font-semibold text-rose-600 hover:text-rose-500"
              >
                Continue shopping
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
