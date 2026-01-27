import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const highlights = [
  { label: "Total sellers", value: "2,418" },
  { label: "Active products", value: "48,902" },
  { label: "Pending reviews", value: "143" },
  { label: "Fulfillment score", value: "98%" },
];

export default function AdminOverviewPage() {
  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
            Admin overview
          </p>
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">
            Monitor platform health and compliance.
          </h1>
          <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300">
            Review seller onboarding, merchandising metrics, and fulfillment
            signals in one place.
          </p>
        </div>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <Card
              key={item.label}
              className="border border-emerald-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70"
            >
              <CardContent className="space-y-2 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-500">
                  {item.label}
                </p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {item.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="border border-emerald-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70 lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-lg text-slate-900 dark:text-white">
                Compliance checks
              </CardTitle>
              <Button variant="outline" size="sm">
                Review all
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              {[
                "Seller KYC pending · 18",
                "Disputed products · 5",
                "Fulfillment audit items · 3",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950/60"
                >
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border border-emerald-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 dark:text-white">
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {["Approve vendor", "Flag listing", "Send audit"].map((item) => (
                <Button key={item} variant="outline" className="w-full">
                  {item}
                </Button>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
