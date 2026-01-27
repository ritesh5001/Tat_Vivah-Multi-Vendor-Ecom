import { Card, CardContent } from "@/components/ui/card";
import ProductDetailClient from "@/components/product-detail-client";
import ProductImageCarousel from "@/components/product-image-carousel";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchProduct(id: string) {
  if (!API_BASE_URL) {
    return null;
  }
  const response = await fetch(`${API_BASE_URL}/v1/products/${id}`, {
    next: { revalidate: 60 },
  });
  if (!response.ok) {
    return null;
  }
  return response.json();
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const data = await fetchProduct(resolvedParams.id);
  const product = data?.product;
  const images = product?.images?.length
    ? product.images
    : ["/images/product-placeholder.svg"];

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <ProductImageCarousel images={images} title={product?.title} />
          {product ? (
            <ProductDetailClient product={product} />
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
                Product unavailable
              </p>
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
                We couldn't load this product.
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Please return to the marketplace and try another listing.
              </p>
            </div>
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Highlights",
              icon: "✨",
              copy: "Handwoven silk, rich zari border, artisan-crafted finish.",
            },
            {
              title: "Fabric & Care",
              icon: "🧵",
              copy: "Dry clean only. Store folded with muslin cloth.",
            },
            {
              title: "Delivery",
              icon: "🚚",
              copy: "Ships within 48 hours with insured delivery.",
            },
          ].map((item) => (
            <Card
              key={item.title}
              className="border border-rose-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70"
            >
              <CardContent className="space-y-3 p-6">
                <div className="flex items-center gap-2">
                  <span className="text-lg" aria-hidden="true">
                    {item.icon}
                  </span>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </p>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {item.copy}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </div>
  );
}
