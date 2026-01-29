"use client";

import * as React from "react";
import ImageKit from "imagekit-javascript";
import { Loader2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getCategories } from "@/services/catalog";
import {
  addVariantToProduct,
  createSellerProduct,
  deleteSellerProduct,
  listSellerProducts,
  updateSellerProduct,
  updateVariant,
  updateVariantStock,
} from "@/services/seller-products";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const IMAGEKIT_PUBLIC_KEY = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
const IMAGEKIT_URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getMissingImageKitConfig = () => {
  const missing: string[] = [];
  if (!IMAGEKIT_PUBLIC_KEY) missing.push("NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY");
  if (!IMAGEKIT_URL_ENDPOINT) missing.push("NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT");
  if (!API_BASE_URL) missing.push("NEXT_PUBLIC_API_BASE_URL");
  return missing;
};

export default function SellerProductsPage() {
  const [categories, setCategories] = React.useState<
    Array<{ id: string; name: string }>
  >([]);
  const [products, setProducts] = React.useState<Array<any>>([]);
  const [loading, setLoading] = React.useState(true);
  const [form, setForm] = React.useState({
    categoryId: "",
    title: "",
    description: "",
    isPublished: true,
  });
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [images, setImages] = React.useState<
    Array<{ url: string; fileId: string; name: string }>
  >([]);
  const [uploadingImages, setUploadingImages] = React.useState(false);
  const [variantForm, setVariantForm] = React.useState({
    sku: "",
    price: "",
    compareAtPrice: "",
    initialStock: "",
  });
  const [activeProductId, setActiveProductId] = React.useState<string | null>(
    null
  );
  const [editingProductId, setEditingProductId] = React.useState<string | null>(
    null
  );
  const [editForm, setEditForm] = React.useState({
    categoryId: "",
    title: "",
    description: "",
    isPublished: true,
  });
  const [stockEdits, setStockEdits] = React.useState<Record<string, string>>(
    {}
  );
  const [variantEditsOpen, setVariantEditsOpen] = React.useState<
    Record<string, boolean>
  >({});
  const [variantEdits, setVariantEdits] = React.useState<
    Record<string, { price: string; compareAtPrice: string }>
  >({});

  const loadAll = React.useCallback(async () => {
    setLoading(true);
    const results = await Promise.allSettled([
      getCategories(),
      listSellerProducts(),
    ]);

    const categoryResult = results[0];
    const productResult = results[1];

    if (categoryResult.status === "fulfilled") {
      setCategories(categoryResult.value.categories ?? []);
    } else {
      toast.error(
        categoryResult.reason instanceof Error
          ? categoryResult.reason.message
          : "Unable to load categories"
      );
      setCategories([]);
    }

    if (productResult.status === "fulfilled") {
      setProducts(productResult.value.products ?? []);
    } else {
      toast.error(
        productResult.reason instanceof Error
          ? productResult.reason.message
          : "Unable to load products"
      );
      setProducts([]);
    }

    setLoading(false);
  }, []);

  const imagekit = React.useMemo(() => {
    if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_URL_ENDPOINT || !API_BASE_URL) {
      return null;
    }
    return new ImageKit({
      publicKey: IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: IMAGEKIT_URL_ENDPOINT,
    });
  }, []);

  React.useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleCreateProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.categoryId || !form.title) {
      toast.error("Select a category and title.");
      return;
    }
    if (images.length < 1) {
      toast.error("Add at least one product image.");
      return;
    }
    try {
      const result = await createSellerProduct({
        categoryId: form.categoryId,
        title: form.title,
        description: form.description || undefined,
        isPublished: form.isPublished,
        images: images.map((image) => image.url),
      });
      toast.success("Product created.");
      setForm({ categoryId: "", title: "", description: "", isPublished: true });
      setImages([]);
      setShowCreateModal(false);

      setProducts((prev) => [
        {
          ...result.product,
          category: categories.find((c) => c.id === form.categoryId) ?? null,
          variants: [],
          images: images.map((image) => image.url),
        },
        ...prev,
      ]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Create failed");
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteSellerProduct(productId);
      toast.success("Product deleted.");
      setProducts((prev) => prev.filter((product) => product.id !== productId));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  };

  const handleAddVariant = async (productId: string) => {
    if (!variantForm.sku || !variantForm.price) {
      toast.error("Enter SKU and price.");
      return;
    }
    try {
      const result = await addVariantToProduct(productId, {
        sku: variantForm.sku,
        price: Number(variantForm.price),
        compareAtPrice: variantForm.compareAtPrice
          ? Number(variantForm.compareAtPrice)
          : undefined,
        initialStock: variantForm.initialStock
          ? Number(variantForm.initialStock)
          : undefined,
      });
      toast.success("Variant added.");
      setVariantForm({ sku: "", price: "", compareAtPrice: "", initialStock: "" });
      setActiveProductId(null);
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId
            ? {
                ...product,
                variants: [...(product.variants ?? []), result.variant],
              }
            : product
        )
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Variant failed");
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProductId(product.id);
    setEditForm({
      categoryId: product.categoryId ?? product.category?.id ?? "",
      title: product.title ?? "",
      description: product.description ?? "",
      isPublished: Boolean(product.isPublished),
    });
  };

  const handleSaveProduct = async () => {
    if (!editingProductId) return;
    try {
      const result = await updateSellerProduct(editingProductId, {
        categoryId: editForm.categoryId || undefined,
        title: editForm.title || undefined,
        description: editForm.description || undefined,
        isPublished: editForm.isPublished,
      });
      toast.success("Product updated.");
      setEditingProductId(null);
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingProductId
            ? {
                ...product,
                ...result.product,
                category:
                  categories.find((c) => c.id === result.product.category?.id) ??
                  product.category,
              }
            : product
        )
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  };

  const handleStockChange = async (variantId: string) => {
    const nextStock = Number(stockEdits[variantId]);
    if (Number.isNaN(nextStock) || nextStock < 0) {
      toast.error("Enter a valid stock number.");
      return;
    }
    try {
      const result = await updateVariantStock(variantId, nextStock);
      toast.success("Stock updated.");
      setStockEdits((prev) => ({ ...prev, [variantId]: "" }));
      setProducts((prev) =>
        prev.map((product) => ({
          ...product,
          variants: (product.variants ?? []).map((variant: any) =>
            variant.id === variantId
              ? {
                  ...variant,
                  inventory: {
                    ...(variant.inventory ?? {}),
                    stock: result.inventory.stock,
                  },
                }
              : variant
          ),
        }))
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Stock update failed");
    }
  };

  const handleVariantEditToggle = (variant: any) => {
    setVariantEditsOpen((prev) => ({
      ...prev,
      [variant.id]: !prev[variant.id],
    }));
    setVariantEdits((prev) => ({
      ...prev,
      [variant.id]: {
        price: prev[variant.id]?.price ?? String(variant.price ?? ""),
        compareAtPrice:
          prev[variant.id]?.compareAtPrice ??
          String(variant.compareAtPrice ?? ""),
      },
    }));
  };

  const handleVariantUpdate = async (variantId: string) => {
    const edit = variantEdits[variantId];
    if (!edit?.price) {
      toast.error("Enter a price.");
      return;
    }
    const price = Number(edit.price);
    const compareAt = edit.compareAtPrice
      ? Number(edit.compareAtPrice)
      : null;
    if (Number.isNaN(price)) {
      toast.error("Enter a valid price.");
      return;
    }
    if (compareAt !== null && Number.isNaN(compareAt)) {
      toast.error("Enter a valid compare-at price.");
      return;
    }

    try {
      const result = await updateVariant(variantId, {
        price,
        compareAtPrice: compareAt,
      });
      toast.success("Variant updated.");
      setVariantEditsOpen((prev) => ({ ...prev, [variantId]: false }));
      setProducts((prev) =>
        prev.map((product) => ({
          ...product,
          variants: (product.variants ?? []).map((variant: any) =>
            variant.id === variantId
              ? {
                  ...variant,
                  price: result.variant.price,
                  compareAtPrice: result.variant.compareAtPrice ?? null,
                }
              : variant
          ),
        }))
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  };

  const handleUploadImages = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    if (!imagekit) {
      const missing = getMissingImageKitConfig();
      toast.error(
        missing.length
          ? `Missing env: ${missing.join(", ")}`
          : "ImageKit is not configured."
      );
      return;
    }

    const remaining = 5 - images.length;
    if (remaining <= 0) {
      toast.error("You can upload up to 5 images.");
      return;
    }

    const limitedFiles = files.slice(0, remaining);
    setUploadingImages(true);

    try {
      const authResponse = await fetch(`${API_BASE_URL}/v1/imagekit/auth`);
      if (!authResponse.ok) {
        const authData = await authResponse.json().catch(() => null);
        const authMessage =
          authData?.message ?? "ImageKit auth failed. Check backend env.";
        toast.error(authMessage);
        return;
      }

      const authData = (await authResponse.json()) as {
        signature: string;
        token: string;
        expire: number;
      };

      for (const file of limitedFiles) {
        const result = await imagekit.upload({
          file,
          fileName: file.name,
          folder: "/tatvivah/products",
          useUniqueFileName: true,
          signature: authData.signature,
          token: authData.token,
          expire: authData.expire,
        });

        setImages((prev) => [
          ...prev,
          { url: result.url, fileId: result.fileId, name: result.name },
        ]);
      }
      toast.success("Images uploaded.");
    } catch (error) {
      console.error("Image upload failed:", error);
      const message =
        error instanceof Error
          ? error.message
          : (error as any)?.response?.data?.message ??
            (error as any)?.response?.message ??
            (error as any)?.message ??
            "Image upload failed";
      toast.error(
        message
      );
    } finally {
      setUploadingImages(false);
      event.target.value = "";
    }
  };

  const handleRemoveImage = (fileId: string) => {
    setImages((prev) => prev.filter((image) => image.fileId !== fileId));
  };

  const filteredProducts = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product: any) => {
      const title = String(product.title ?? "").toLowerCase();
      const category = String(product.category?.name ?? "").toLowerCase();
      const skuMatch = (product.variants ?? []).some((variant: any) =>
        String(variant.sku ?? "").toLowerCase().includes(query)
      );
      return title.includes(query) || category.includes(query) || skuMatch;
    });
  }, [products, searchQuery]);

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-indigo-50 via-white to-rose-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">
            Product catalog
          </p>
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">
            Create and manage your listings.
          </h1>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Manage all published and draft listings.
          </p>
          <Button onClick={() => setShowCreateModal(true)}>Add product</Button>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-indigo-100/70 bg-white/80 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex flex-1 items-center gap-2">
            <Search className="h-4 w-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by product, category, or SKU"
              className="border-0 bg-transparent focus-visible:ring-0"
            />
          </div>
          <Button variant="outline" onClick={() => setSearchQuery("")}>Clear</Button>
        </div>

        <section className="grid gap-6 md:grid-cols-2">
          {loading ? (
            <p className="text-sm text-slate-500">Loading products...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-sm text-slate-500">No products yet.</p>
          ) : (
            filteredProducts.map((product: any) => (
              <Card
                key={product.id}
                className={`border border-indigo-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70 ${
                  product.deletedByAdmin ? "opacity-70" : ""
                }`}
              >
                <CardHeader className="flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-slate-900 dark:text-white">
                      {product.title}
                    </CardTitle>
                    <p className="text-sm text-slate-500 dark:text-slate-300">
                      {product.category?.name ?? "Uncategorized"}
                    </p>
                    {product.deletedByAdmin ? (
                      <p className="mt-2 text-xs font-semibold text-rose-600">
                        Deleted by admin{product.deletedByAdminReason ? ` · ${product.deletedByAdminReason}` : ""}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        editingProductId === product.id
                          ? setEditingProductId(null)
                          : handleEditProduct(product)
                      }
                      disabled={product.deletedByAdmin}
                    >
                      {editingProductId === product.id ? "Close" : "Edit"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      disabled={product.deletedByAdmin}
                    >
                      Delete
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {product.images?.length ? (
                    <div className="grid grid-cols-3 gap-2">
                      {product.images.slice(0, 3).map((image: string) => (
                        <div
                          key={image}
                          className="h-20 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700"
                        >
                          <img
                            src={image}
                            alt={product.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {editingProductId === product.id && (
                    <div className="grid gap-4 rounded-2xl border border-dashed border-slate-200 p-4 dark:border-slate-700">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="dark:text-slate-200">Category</Label>
                          <select
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200"
                            value={editForm.categoryId}
                            onChange={(event) =>
                              setEditForm((prev) => ({
                                ...prev,
                                categoryId: event.target.value,
                              }))
                            }
                            disabled={product.deletedByAdmin}
                          >
                            <option value="">Select category</option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label className="dark:text-slate-200">Title</Label>
                          <Input
                            value={editForm.title}
                            onChange={(event) =>
                              setEditForm((prev) => ({
                                ...prev,
                                title: event.target.value,
                              }))
                            }
                            disabled={product.deletedByAdmin}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="dark:text-slate-200">Description</Label>
                        <Input
                          value={editForm.description}
                          onChange={(event) =>
                            setEditForm((prev) => ({
                              ...prev,
                              description: event.target.value,
                            }))
                          }
                          disabled={product.deletedByAdmin}
                        />
                      </div>
                      <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <input
                          type="checkbox"
                          checked={editForm.isPublished}
                          onChange={(event) =>
                            setEditForm((prev) => ({
                              ...prev,
                              isPublished: event.target.checked,
                            }))
                          }
                          disabled={product.deletedByAdmin}
                        />
                        Published
                      </label>
                      <Button
                        className="w-full sm:w-auto"
                        onClick={handleSaveProduct}
                        disabled={product.deletedByAdmin}
                      >
                        Save changes
                      </Button>
                    </div>
                  )}
                  <div className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                    {product.variants?.length ? (
                      product.variants.map((variant: any) => (
                        <div
                          key={variant.id}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950/60"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {variant.sku}
                              </p>
                              <p className="text-xs">
                                Stock: {variant.inventory?.stock ?? 0}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <p className="font-semibold text-rose-600">
                                {currency.format(variant.price)}
                              </p>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  if (product.deletedByAdmin) return;
                                  handleVariantEditToggle(variant);
                                }}
                                disabled={product.deletedByAdmin}
                              >
                                {variantEditsOpen[variant.id] ? "Close" : "Edit"}
                              </Button>
                            </div>
                          </div>

                          {variantEditsOpen[variant.id] ? (
                            <div className="mt-4 grid gap-3 rounded-xl border border-dashed border-slate-200 p-3 dark:border-slate-700">
                              <div className="grid gap-3 sm:grid-cols-3">
                                <div className="space-y-1">
                                  <Label className="text-xs text-slate-500">Price</Label>
                                  <Input
                                    value={variantEdits[variant.id]?.price ?? ""}
                                    onChange={(event) =>
                                      setVariantEdits((prev) => ({
                                        ...prev,
                                        [variant.id]: {
                                          price: event.target.value,
                                          compareAtPrice:
                                            prev[variant.id]?.compareAtPrice ?? "",
                                        },
                                      }))
                                    }
                                    placeholder="Price"
                                    disabled={product.deletedByAdmin}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs text-slate-500">Compare at</Label>
                                  <Input
                                    value={
                                      variantEdits[variant.id]?.compareAtPrice ??
                                      ""
                                    }
                                    onChange={(event) =>
                                      setVariantEdits((prev) => ({
                                        ...prev,
                                        [variant.id]: {
                                          price: prev[variant.id]?.price ?? "",
                                          compareAtPrice: event.target.value,
                                        },
                                      }))
                                    }
                                    placeholder="Compare at"
                                    disabled={product.deletedByAdmin}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs text-slate-500">Stock</Label>
                                  <Input
                                    value={
                                      stockEdits[variant.id] ??
                                      String(variant.inventory?.stock ?? 0)
                                    }
                                    onChange={(event) =>
                                      setStockEdits((prev) => ({
                                        ...prev,
                                        [variant.id]: event.target.value,
                                      }))
                                    }
                                    placeholder="Stock"
                                    disabled={product.deletedByAdmin}
                                  />
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleVariantUpdate(variant.id)}
                                  disabled={product.deletedByAdmin}
                                >
                                  Save pricing
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStockChange(variant.id)}
                                  disabled={product.deletedByAdmin}
                                >
                                  Update stock
                                </Button>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No variants yet.</p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-dashed border-slate-200 p-4 dark:border-slate-700">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Add variant
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setActiveProductId((prev) =>
                            prev === product.id ? null : product.id
                          )
                        }
                        disabled={product.deletedByAdmin}
                      >
                        {activeProductId === product.id ? "Close" : "Open"}
                      </Button>
                    </div>
                    {activeProductId === product.id && (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Input
                          placeholder="SKU"
                          value={variantForm.sku}
                          onChange={(event) =>
                            setVariantForm((prev) => ({
                              ...prev,
                              sku: event.target.value,
                            }))
                          }
                          disabled={product.deletedByAdmin}
                        />
                        <Input
                          placeholder="Price"
                          value={variantForm.price}
                          onChange={(event) =>
                            setVariantForm((prev) => ({
                              ...prev,
                              price: event.target.value,
                            }))
                          }
                          disabled={product.deletedByAdmin}
                        />
                        <Input
                          placeholder="Compare at"
                          value={variantForm.compareAtPrice}
                          onChange={(event) =>
                            setVariantForm((prev) => ({
                              ...prev,
                              compareAtPrice: event.target.value,
                            }))
                          }
                          disabled={product.deletedByAdmin}
                        />
                        <Input
                          placeholder="Initial stock"
                          value={variantForm.initialStock}
                          onChange={(event) =>
                            setVariantForm((prev) => ({
                              ...prev,
                              initialStock: event.target.value,
                            }))
                          }
                          disabled={product.deletedByAdmin}
                        />
                        <Button
                          className="sm:col-span-2"
                          onClick={() => handleAddVariant(product.id)}
                          disabled={product.deletedByAdmin}
                        >
                          Save variant
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </section>
      </div>

      {showCreateModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-3xl border border-indigo-100 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">
                  New product
                </p>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  Add a listing
                </h2>
              </div>
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Close
              </Button>
            </div>
            <form className="grid gap-4" onSubmit={handleCreateProduct}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="dark:text-slate-200">Category</Label>
                  <select
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200"
                    value={form.categoryId}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        categoryId: event.target.value,
                      }))
                    }
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="dark:text-slate-200">Title</Label>
                  <Input
                    value={form.title}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, title: event.target.value }))
                    }
                    placeholder="Premium linen kurta"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="dark:text-slate-200">Description</Label>
                <Input
                  value={form.description}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Fabric details, fit, and highlights"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      isPublished: event.target.checked,
                    }))
                  }
                />
                Publish immediately
              </label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="dark:text-slate-200">Product images</Label>
                  <span className="text-xs text-slate-500">
                    {images.length}/5 uploaded
                  </span>
                </div>
                <div className="rounded-2xl border border-dashed border-slate-200 p-4 dark:border-slate-700">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleUploadImages}
                    className="hidden"
                    id="product-image-upload"
                  />
                  <label
                    htmlFor="product-image-upload"
                    className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-600 transition hover:border-indigo-200 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300"
                  >
                    {uploadingImages ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading images...
                      </div>
                    ) : (
                      <span>Click to upload images (1-5)</span>
                    )}
                  </label>
                  {images.length > 0 && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      {images.map((image) => (
                        <div
                          key={image.fileId}
                          className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700"
                        >
                          <img
                            src={image.url}
                            alt={image.name}
                            className="h-24 w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(image.fileId)}
                            className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                            aria-label="Remove image"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={uploadingImages}>
                  Create product
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
