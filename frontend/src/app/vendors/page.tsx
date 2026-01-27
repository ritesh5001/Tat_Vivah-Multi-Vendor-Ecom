import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const vendors = [
  {
    slug: "aarohi-atelier",
    name: "Aarohi Atelier",
    category: "Sarees & Ethnic",
    location: "Ahmedabad",
    rating: "4.9",
  },
  {
    slug: "saffron-loom",
    name: "Saffron Loom",
    category: "Cotton & Daily Wear",
    location: "Mumbai",
    rating: "4.8",
  },
  {
    slug: "lenscraft-tailors",
    name: "LensCraft Tailors",
    category: "Men's Formal",
    location: "Delhi",
    rating: "4.7",
  },
  {
    slug: "bloomarc-studio",
    name: "BloomArc Studio",
    category: "Designer Wear",
    location: "Jaipur",
    rating: "4.8",
  },
];

export default function VendorsPage() {
  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
              Verified vendors
            </p>
            <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">
              Trusted fashion sellers across categories.
            </h1>
            <p className="max-w-xl text-base text-slate-600 dark:text-slate-300">
              Browse verified fashion brands with consistent quality, pricing,
              and on-time delivery.
            </p>
          </div>
          <div className="flex w-full max-w-sm flex-col gap-3 rounded-3xl border border-rose-100 bg-white/80 p-4 shadow-lg shadow-rose-100/30 dark:border-rose-500/20 dark:bg-slate-900/70">
            <Input placeholder="Search brand or city" />
            <Button>Search brands</Button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vendors.map((vendor) => (
            <Card
              key={vendor.slug}
              className="border border-rose-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70"
            >
              <CardHeader className="space-y-2">
                <CardTitle className="text-lg text-slate-900 dark:text-white">
                  {vendor.name}
                </CardTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {vendor.category}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                  <span>{vendor.location}</span>
                  <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600 dark:bg-rose-500/20 dark:text-rose-200">
                    ★ {vendor.rating}
                  </span>
                </div>
                <Link
                  href={`/vendors/${vendor.slug}`}
                  className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:text-rose-600 dark:border-slate-700 dark:text-slate-300"
                >
                  View profile
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
