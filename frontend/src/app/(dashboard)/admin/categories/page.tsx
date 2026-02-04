"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from "@/services/admin";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const [loading, setLoading] = React.useState(true);
  const [categories, setCategories] = React.useState<Array<any>>([]);
  const [name, setName] = React.useState("");
  const [editing, setEditing] = React.useState<Record<string, string>>({});
  const [saving, setSaving] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAdminCategories();
      setCategories(result.categories ?? []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load categories"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Enter a category name.");
      return;
    }
    setSaving(true);
    try {
      await createAdminCategory(name.trim());
      toast.success("Category created.");
      setName("");
      load();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to create category"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string) => {
    const nextName = (editing[id] ?? "").trim();
    if (!nextName) {
      toast.error("Enter a category name.");
      return;
    }
    setSaving(true);
    try {
      await updateAdminCategory(id, { name: nextName });
      toast.success("Category updated.");
      setEditing((prev) => ({ ...prev, [id]: "" }));
      load();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update category"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      if (isActive) {
        await deleteAdminCategory(id);
        toast.success("Category deactivated.");
      } else {
        await updateAdminCategory(id, { isActive: true });
        toast.success("Category activated.");
      }
      load();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update category"
      );
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] bg-background">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16 lg:py-20"
      >
        <div className="space-y-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-gold">
            Catalog Settings
          </p>
          <h1 className="font-serif text-4xl font-light tracking-tight text-foreground sm:text-5xl">
            Category Management
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Create, rename, or deactivate product categories across the platform.
          </p>
        </div>

        <div className="border border-border-soft bg-card p-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            New Category
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              placeholder="Category name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-11"
            />
            <Button onClick={handleCreate} disabled={saving} className="h-11 px-6">
              {saving ? "Saving..." : "Add Category"}
            </Button>
          </div>
        </div>

        <div className="border border-border-soft bg-card">
          <div className="border-b border-border-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1">
                  Catalog
                </p>
                <p className="font-serif text-lg font-light text-foreground">
                  All Categories
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {categories.length} total
              </p>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No categories yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-border-soft">
              {categories.map((category: any) => {
                const editValue = editing[category.id] ?? category.name;
                return (
                  <div
                    key={category.id}
                    className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex-1 space-y-2">
                      <Input
                        value={editValue}
                        onChange={(event) =>
                          setEditing((prev) => ({
                            ...prev,
                            [category.id]: event.target.value,
                          }))
                        }
                        className="h-11"
                      />
                      <p className="text-xs text-muted-foreground">
                        Slug: {category.slug}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`px-3 py-1 text-[10px] uppercase tracking-wider border ${
                          category.isActive
                            ? "border-[#7B9971]/30 text-[#5A7352] bg-[#7B9971]/5"
                            : "border-[#A67575]/30 text-[#7A5656] bg-[#A67575]/5"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdate(category.id)}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className={
                          category.isActive
                            ? "border-[#A67575]/40 text-[#7A5656] hover:border-[#A67575]/60"
                            : "border-[#7B9971]/40 text-[#5A7352] hover:border-[#7B9971]/60"
                        }
                        onClick={() => handleToggle(category.id, category.isActive)}
                      >
                        {category.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
