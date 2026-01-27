import Link from "next/link";

const footerSections = [
  {
    title: "Platform",
    links: ["Vendors", "Marketplace", "Payments", "Logistics"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Partners", "Press"],
  },
  {
    title: "Support",
    links: ["Help center", "Contact", "Security", "Compliance"],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/70 py-10 backdrop-blur dark:border-slate-800/60 dark:bg-slate-950/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              TatVivah
            </p>
            <p className="max-w-sm text-sm text-slate-600 dark:text-slate-400">
              A trusted multi-vendor commerce experience for businesses and
              customers.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:border-rose-300 hover:text-rose-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-rose-300"
            >
              Login
            </Link>
            <Link
              href="/register/seller"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900"
            >
              Become a seller
            </Link>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {footerSections.map((section) => (
            <div key={section.title}>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {section.title}
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                {section.links.map((link) => (
                  <li key={link}>{link}</li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Contact
            </p>
            <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <p>support@tatvivah.com</p>
              <p>+91 98765 43210</p>
              <p>Ahmedabad, India</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t border-slate-200/70 pt-6 text-xs text-slate-500 dark:border-slate-800/60 dark:text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© 2026 TatVivah. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
