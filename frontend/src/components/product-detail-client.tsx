"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addCartItem } from "@/services/cart";

interface Variant {
  id: string;
  sku: string;
  price: number;
  compareAtPrice?: number | null;
  inventory?: {
    stock: number;
  } | null;
}

interface ProductDetailClientProps {
  product: {
    id: string;
    title: string;
    description?: string | null;
    category?: { name: string } | null;
    sellerId?: string;
    variants: Variant[];
  };
}

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const router = useRouter();
  const [selectedVariantId, setSelectedVariantId] = React.useState(
    product.variants?.[0]?.id ?? ""
  );
  const [loading, setLoading] = React.useState(false);

  const selectedVariant = product.variants.find(
    (variant) => variant.id === selectedVariantId
  );

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error("Please choose a variant first.");
      return;
    }

    if (typeof document !== "undefined") {
      const hasToken = document.cookie.match(/(?:^|; )tatvivah_access=([^;]*)/);
      if (!hasToken) {
        toast.error("Please sign in to add items to cart.");
        router.push("/login?force=1");
        return;
      }
    }

    setLoading(true);
    try {
      await addCartItem({
        productId: product.id,
        variantId: selectedVariant.id,
        quantity: 1,
      });
      toast.success("Added to cart.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to add to cart";
      if (/access token required|unauthorized/i.test(message)) {
        toast.error("Please sign in to add items to cart.");
        router.push("/login?force=1");
        return;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
          {product.category?.name ?? "Featured"}
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900 dark:text-white">
          {product.title}
        </h1>
        <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
          Verified sellers · Delivery across India
        </p>
      </div>

      <div className="flex items-center gap-4">
        <p className="text-3xl font-semibold text-rose-600">
          {selectedVariant ? currency.format(selectedVariant.price) : "—"}
        </p>
        {selectedVariant?.compareAtPrice ? (
          <span className="text-sm text-slate-400 line-through">
            {currency.format(selectedVariant.compareAtPrice)}
          </span>
        ) : null}
        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600 dark:bg-rose-500/20 dark:text-rose-200">
          In stock
        </span>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300">
        {product.description ??
          "Curated premium listing with verified quality assurance."}
      </p>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Select variant
        </p>
        <div className="flex flex-wrap gap-2">
          {product.variants.length === 0 ? (
            <span className="text-sm text-slate-500">
              Variants coming soon
            </span>
          ) : (
            product.variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedVariantId(variant.id)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  selectedVariantId === variant.id
                    ? "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200"
                    : "border-slate-200 text-slate-600 hover:border-rose-200 hover:text-rose-600 dark:border-slate-700 dark:text-slate-300"
                }`}
              >
                {variant.sku}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button size="lg" onClick={handleAddToCart} disabled={loading}>
          {loading ? "Adding..." : "Add to cart"}
        </Button>
        <Link
          href="/cart"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:text-rose-600 dark:border-slate-700 dark:text-slate-300"
        >
          View cart
        </Link>
      </div>
    </div>
  );
}
