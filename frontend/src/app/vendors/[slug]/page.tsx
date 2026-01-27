import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  "Custom tailoring",
  "Fabric sourcing",
  "Size & fit guidance",
  "Express alterations",
];

const packages = [
  {
    name: "Signature Ethnic Set",
    price: "₹7,800",
    detail: "Handcrafted fabric + premium finish",
  },
  {
    name: "Royal Couture",
    price: "₹12,500",
    detail: "Custom silhouette + priority tailoring",
  },
];

export default function VendorProfilePage() {
  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <section className="flex flex-col gap-6 rounded-3xl border border-rose-100 bg-white/80 p-8 shadow-lg shadow-rose-100/30 dark:border-rose-500/20 dark:bg-slate-900/70">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
                Vendor profile
              </p>
              <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">
                Aarohi Atelier
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Ahmedabad · Sarees & Ethnic · ★ 4.9 (4,200+ orders)
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">Save brand</Button>
              <Button>Contact seller</Button>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Premium ethnic wear with handcrafted fabrics, curated collections,
            and dedicated fit assistance.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="border border-rose-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 dark:text-white">
                Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {services.map((service) => (
                <div
                  key={service}
                  className="rounded-2xl border border-rose-100 bg-rose-50/60 px-4 py-3 dark:border-rose-500/20 dark:bg-rose-500/10"
                >
                  {service}
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border border-rose-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 dark:text-white">
                Packages
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {packages.map((pack) => (
                <div
                  key={pack.name}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950/60"
                >
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {pack.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {pack.detail}
                  </p>
                  <p className="mt-4 text-lg font-semibold text-rose-600">
                    {pack.price}
                  </p>
                  <Button size="sm" className="mt-3">
                    Request quote
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="flex flex-col gap-6 rounded-3xl border border-rose-100 bg-white/80 p-6 shadow-lg shadow-rose-100/30 dark:border-rose-500/20 dark:bg-slate-900/70">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Featured offerings
            </h2>
            <Link
              href="/marketplace"
              className="text-sm font-semibold text-rose-600 hover:text-rose-500"
            >
              Browse collections
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {["Festive Saree Capsule", "Signature Silk Collection"].map(
              (item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300"
              >
                {item}
              </div>
              )
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
