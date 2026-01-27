import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type SearchParams = {
  page?: string;
  categoryId?: string;
  search?: string;
};

async function fetchCategories() {
  if (!API_BASE_URL) {
    return [] as Array<{ id: string; name: string }>; // fallback
  }
  const response = await fetch(`${API_BASE_URL}/v1/categories`, {
    next: { revalidate: 120 },
  });
  if (!response.ok) {
    return [] as Array<{ id: string; name: string }>;
  }
  const data = await response.json();
  return (data?.categories ?? []) as Array<{ id: string; name: string }>;
}

async function fetchProducts(params: {
  page: number;
  limit: number;
  categoryId?: string;
  search?: string;
}) {
  if (!API_BASE_URL) {
    return { data: [], pagination: { page: 1, limit: params.limit, total: 0, totalPages: 1 } };
  }
  const query = new URLSearchParams();
  query.set("page", String(params.page));
  query.set("limit", String(params.limit));
  if (params.categoryId) query.set("categoryId", params.categoryId);
  if (params.search) query.set("search", params.search);

  const response = await fetch(`${API_BASE_URL}/v1/products?${query.toString()}`, {
    next: { revalidate: 60 },
  });
  if (!response.ok) {
    return { data: [], pagination: { page: params.page, limit: params.limit, total: 0, totalPages: 1 } };
  }
  return response.json();
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const page = Number(resolvedParams?.page ?? "1") || 1;
  const categoryId = resolvedParams?.categoryId;
  const search = resolvedParams?.search?.trim();

  const [categories, productsResponse] = await Promise.all([
    fetchCategories(),
    fetchProducts({ page, limit: 9, categoryId, search }),
  ]);

  const products = productsResponse?.data ?? [];
  const pagination = productsResponse?.pagination ?? {
    page,
    limit: 9,
    total: 0,
    totalPages: 1,
  };

  const buildUrl = (nextPage: number, nextCategoryId?: string) => {
    const params = new URLSearchParams();
    params.set("page", String(nextPage));
    const categoryParam = typeof nextCategoryId === "string" ? nextCategoryId : categoryId;
    if (categoryParam) params.set("categoryId", categoryParam);
    if (search) params.set("search", search);
    return `/marketplace?${params.toString()}`;
  };

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
        <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
              TatVivah Marketplace
            </p>
            <h1 className="text-4xl font-semibold text-slate-900 dark:text-white sm:text-5xl">
              Shop verified fashion sellers and premium collections.
            </h1>
            <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300">
              Curated clothing and accessories from verified sellers—built for
              fast discovery and trusted checkout.
            </p>
          </div>
          <form className="flex w-full max-w-md flex-col gap-3 rounded-3xl border border-rose-100 bg-white/80 p-4 shadow-lg shadow-rose-100/30 dark:border-rose-500/20 dark:bg-slate-900/70">
            <Input
              name="search"
              defaultValue={search ?? ""}
              placeholder="Search brands, styles, categories"
            />
            <Button size="lg" type="submit">
              Search fashion
            </Button>
          </form>
        </section>

        <section className="flex flex-wrap gap-3">
          {categories.length === 0 ? (
            <span className="text-sm text-slate-500">
              Categories loading or unavailable.
            </span>
          ) : (
            categories.map((category) => (
              <Link
                key={category.id}
                href={buildUrl(1, category.id)}
                className={`rounded-full border px-4 py-2 text-sm shadow-sm transition ${
                  categoryId === category.id
                    ? "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200"
                    : "border-rose-100 bg-white text-slate-600 hover:border-rose-200 hover:text-rose-600 dark:border-rose-500/20 dark:bg-white/5 dark:text-slate-300"
                }`}
              >
                {category.name}
              </Link>
            ))
          )}
        </section>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.length === 0 ? (
            <Card className="border border-rose-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70 sm:col-span-2 lg:col-span-3">
              <CardContent className="p-6 text-sm text-slate-600 dark:text-slate-300">
                No products found. Try adjusting your search or filters.
              </CardContent>
            </Card>
          ) : (
            products.map((product: any) => (
              <Card
                key={product.id}
                className="group border border-rose-100/70 bg-white/80 transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/70"
              >
                <div className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 shadow-inner dark:border-slate-800 dark:bg-slate-950">
                  <img
                    src={product.images?.[0] ?? "/images/product-placeholder.svg"}
                    alt={product.title}
                    className="aspect-[4/3] w-full bg-white object-contain p-4 transition duration-300 group-hover:scale-105 dark:bg-slate-950"
                    loading="lazy"
                  />
                </div>
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-rose-500">
                    <span>{product.category?.name ?? "Trending"}</span>
                    <span className="rounded-full bg-rose-100 px-2 py-1 text-[10px] text-rose-600 dark:bg-rose-500/20 dark:text-rose-200">
                      Verified
                    </span>
                  </div>
                  <CardTitle className="text-lg text-slate-900 dark:text-white">
                    {product.title}
                  </CardTitle>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Category · {product.category?.name ?? "Apparel"}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      View details for pricing
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/product/${product.id}`}
                      className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:text-rose-600 dark:border-slate-700 dark:text-slate-300"
                    >
                      View details
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </section>

        <section className="flex items-center justify-between">
          <Button
            asChild
            variant="outline"
            disabled={pagination.page <= 1}
          >
            <Link href={buildUrl(Math.max(pagination.page - 1, 1))}>Previous</Link>
          </Button>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <Button
            asChild
            variant="outline"
            disabled={pagination.page >= pagination.totalPages}
          >
            <Link href={buildUrl(Math.min(pagination.page + 1, pagination.totalPages))}>
              Next
            </Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
