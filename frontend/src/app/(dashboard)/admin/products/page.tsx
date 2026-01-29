"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteProduct, getAllProducts } from "@/services/admin";
import { getCategories } from "@/services/catalog";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const [loading, setLoading] = React.useState(true);
  const [products, setProducts] = React.useState<Array<any>>([]);
  const [reasons, setReasons] = React.useState<Record<string, string>>({});
  const [categories, setCategories] = React.useState<Array<{ id: string; name: string }>>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const [result, categoryResult] = await Promise.all([
        getAllProducts(),
        getCategories(),
      ]);
      setProducts(result.products ?? []);
      setCategories(categoryResult.categories ?? []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load products"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string) => {
    const reason = reasons[id];
    try {
      await deleteProduct(id, reason);
      toast.success("Product deleted by admin.");
      setReasons((prev) => ({ ...prev, [id]: "" }));
      load();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete product"
      );
    }
  };

  const filteredProducts = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        categoryFilter === "all" || product.categoryId === categoryFilter;

      if (!query) {
        return matchesCategory;
      }

      const haystack = [
        product.title,
        product.sellerEmail,
        product.categoryName,
        product.sellerId,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesCategory && haystack.includes(query);
    });
  }, [products, searchQuery, categoryFilter]);

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
            All products
          </p>
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">
            Manage every listing across sellers.
          </h1>
        </div>

        <Card className="border border-emerald-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900 dark:text-white">
              Products table
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
              <Input
                placeholder="Search by title, seller, or category"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Category
                </label>
                <select
                  className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-emerald-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                >
                  <option value="all">All categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {loading ? (
              <p className="text-sm text-slate-500">Loading products...</p>
            ) : filteredProducts.length === 0 ? (
              <p className="text-sm text-slate-500">No products found.</p>
            ) : (
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  <tr>
                    <th className="py-3">Title</th>
                    <th className="py-3">Seller</th>
                    <th className="py-3">Category</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Moderation</th>
                    <th className="py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">
                        {product.title}
                      </td>
                      <td className="py-3">
                        {product.sellerEmail ?? product.sellerId?.slice(0, 8)}
                      </td>
                      <td className="py-3">
                        {product.categoryName ?? product.categoryId?.slice(0, 6)}
                      </td>
                      <td className="py-3">
                        {product.deletedByAdmin ? "Deleted" : product.isPublished ? "Published" : "Draft"}
                      </td>
                      <td className="py-3">
                        {product.moderation?.status ?? "—"}
                      </td>
                      <td className="py-3">
                        <div className="flex flex-col gap-2">
                          <Input
                            placeholder="Reason"
                            value={reasons[product.id] ?? ""}
                            onChange={(event) =>
                              setReasons((prev) => ({
                                ...prev,
                                [product.id]: event.target.value,
                              }))
                            }
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(product.id)}
                            disabled={product.deletedByAdmin}
                          >
                            {product.deletedByAdmin ? "Deleted" : "Delete"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
