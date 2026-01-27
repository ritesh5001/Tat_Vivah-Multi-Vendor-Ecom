export default function Home() {
  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-slate-50 via-white to-rose-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16">
        <section className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
              TatVivah fashion store
            </p>
            <h1 className="text-4xl font-semibold text-slate-900 sm:text-6xl dark:text-white">
              Shop premium fashion from verified sellers.
            </h1>
            <p className="max-w-xl text-base text-slate-600 sm:text-lg dark:text-slate-300">
              Discover curated clothing, accessories, and seasonal drops with
              fast delivery and trusted checkout.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/marketplace"
                className="rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/30"
              >
                Shop now
              </a>
              <a
                href="/register/seller"
                className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:text-rose-600 dark:border-slate-700 dark:text-slate-200"
              >
                Become a seller
              </a>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="rounded-full border border-rose-100 bg-white px-4 py-2 dark:border-rose-500/30 dark:bg-white/5">
                Cash on delivery
              </span>
              <span className="rounded-full border border-rose-100 bg-white px-4 py-2 dark:border-rose-500/30 dark:bg-white/5">
                7-day returns
              </span>
              <span className="rounded-full border border-rose-100 bg-white px-4 py-2 dark:border-rose-500/30 dark:bg-white/5">
                Verified sellers
              </span>
            </div>
          </div>
          <div className="grid gap-4 rounded-3xl border border-rose-100 bg-white/80 p-6 shadow-xl shadow-rose-100/30 dark:border-rose-500/20 dark:bg-slate-900/70">
            <div className="h-40 rounded-2xl bg-gradient-to-br from-rose-200 via-white to-fuchsia-200 dark:from-rose-500/20 dark:via-slate-900 dark:to-fuchsia-500/20" />
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Signature Ethnic",
                "Everyday Essentials",
                "Festive Picks",
                "Accessories",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="categories" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Shop by category
            </h2>
            <a
              href="/marketplace"
              className="text-sm font-semibold text-rose-600 hover:text-rose-500"
            >
              View all →
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Women",
              "Men",
              "Kids",
              "Ethnic",
              "Western",
              "Accessories",
              "Footwear",
              "Wedding",
            ].map((category) => (
              <a
                key={category}
                href="/marketplace"
                className="group rounded-3xl border border-rose-100 bg-white/80 p-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-1 hover:border-rose-200 hover:text-rose-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200"
              >
                <div className="mb-4 h-24 rounded-2xl bg-gradient-to-br from-rose-100 via-white to-fuchsia-100 dark:from-rose-500/20 dark:via-slate-900 dark:to-fuchsia-500/20" />
                {category}
              </a>
            ))}
          </div>
        </section>

        <section id="bestsellers" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Best sellers
            </h2>
            <a
              href="/marketplace"
              className="text-sm font-semibold text-rose-600 hover:text-rose-500"
            >
              Shop best sellers →
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Handwoven Silk Saree",
                price: "From ₹6,900",
              },
              {
                title: "Cotton Kurta Set",
                price: "From ₹2,400",
              },
              {
                title: "Designer Blazer",
                price: "From ₹4,800",
              },
              {
                title: "Embroidered Lehenga",
                price: "From ₹8,500",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-3xl border border-rose-100 bg-white/90 p-5 shadow-lg shadow-rose-100/30 transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/80"
              >
                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                  <img
                    src="/images/product-placeholder.svg"
                    alt={item.title}
                    className="aspect-[4/3] w-full bg-white object-contain p-3 transition duration-300 group-hover:scale-105 dark:bg-slate-950"
                    loading="lazy"
                  />
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {item.price}
                </p>
                <a
                  href="/marketplace"
                  className="mt-4 inline-flex rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-rose-200 hover:text-rose-600 dark:border-slate-700 dark:text-slate-200"
                >
                  Shop now
                </a>
              </div>
            ))}
          </div>
        </section>

        <section id="new" className="grid gap-6 rounded-3xl border border-rose-100 bg-white/80 p-8 shadow-lg shadow-rose-100/30 dark:border-rose-500/20 dark:bg-slate-900/70 lg:grid-cols-2">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
              New arrivals
            </p>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Fresh drops curated by top sellers.
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Discover limited-edition styles and exclusive vendor collections
              updated weekly.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {["Modern Fusion", "Heritage Edit"].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section id="gifting" className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-rose-100 bg-white/80 p-6 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300 lg:col-span-2">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              Gift-ready picks for every celebration
            </h3>
            <p className="mt-2">
              Elegant packaging, premium materials, and fast delivery for
              festivals, weddings, and corporate gifting.
            </p>
          </div>
          <div className="rounded-3xl border border-rose-100 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
              Gift cards
            </p>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Let them choose with TatVivah digital gift cards.
            </p>
            <a
              href="/marketplace"
              className="mt-4 inline-flex rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-600 px-5 py-2 text-xs font-semibold text-white"
            >
              Buy gift card
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
