"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkout, getCart } from "@/services/cart";
import { toast } from "sonner";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [cartTotal, setCartTotal] = React.useState(0);
  const [hasItems, setHasItems] = React.useState(false);

  React.useEffect(() => {
    const load = async () => {
      try {
        const result = await getCart();
        const items = result.cart.items ?? [];
        setHasItems(items.length > 0);
        const subtotal = items.reduce(
          (sum, item) => sum + item.priceSnapshot * item.quantity,
          0
        );
        setCartTotal(subtotal + (items.length > 0 ? 180 : 0));
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Unable to load cart"
        );
      }
    };
    load();
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      await checkout();
      toast.success("Order placed successfully.");
      router.push("/user/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
            Checkout
          </p>
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">
            Confirm your order details
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border border-rose-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 dark:text-white">
                Shipping details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="dark:text-slate-200">
                    Full name
                  </Label>
                  <Input id="name" placeholder="Aarav Sharma" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="dark:text-slate-200">
                    Phone
                  </Label>
                  <Input id="phone" placeholder="+91 98765 43210" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-slate-200">
                  Email
                </Label>
                <Input id="email" placeholder="you@email.com" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="address" className="dark:text-slate-200">
                    Address line
                  </Label>
                  <Input id="address" placeholder="House no, street" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="dark:text-slate-200">
                    City
                  </Label>
                  <Input id="city" placeholder="Ahmedabad" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes" className="dark:text-slate-200">
                  Delivery notes
                </Label>
                <Input id="notes" placeholder="Preferred delivery timing" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-rose-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 dark:text-white">
                Payment summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{currency.format(Math.max(cartTotal - 180, 0))}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>{hasItems ? "₹180" : "₹0"}</span>
              </div>
              <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                <span>Total</span>
                <span>{currency.format(cartTotal)}</span>
              </div>
              <Button
                size="lg"
                className="w-full"
                onClick={handleCheckout}
                disabled={!hasItems || loading}
              >
                {loading ? "Placing order..." : "Pay & place order"}
              </Button>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Payments are secured with TatVivah protection.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
