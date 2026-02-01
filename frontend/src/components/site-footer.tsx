import Link from "next/link";

const footerSections = [
  {
    title: "Collections",
    links: ["Wedding Wear", "Ethnic Kurtas", "Sherwanis", "Accessories"],
  },
  {
    title: "Company",
    links: ["Our Story", "Artisans", "Sustainability", "Press"],
  },
  {
    title: "Support",
    links: ["Sizing Guide", "Shipping", "Returns", "Contact"],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border-soft bg-cream dark:bg-card">
      <div className="mx-auto w-full max-w-6xl px-6">
        {/* Main Footer Content */}
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-light tracking-tight text-foreground">
                TatVivah
              </h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
                Premium Indian Fashion
              </p>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-sm">
              Curated men's ethnic wear and wedding fashion from India's finest
              artisans and verified sellers. Every piece tells a story of heritage
              and craftsmanship.
            </p>
            <div className="flex gap-3 pt-2">
              <Link
                href="/login"
                className="text-xs uppercase tracking-wider text-muted-foreground transition-colors duration-300 hover:text-foreground border-b border-transparent hover:border-gold pb-1"
              >
                Sign In
              </Link>
              <span className="text-muted-foreground/30">|</span>
              <Link
                href="/register/seller"
                className="text-xs uppercase tracking-wider text-muted-foreground transition-colors duration-300 hover:text-foreground border-b border-transparent hover:border-gold pb-1"
              >
                Become a Seller
              </Link>
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-foreground mb-5">
                {section.title}
              </p>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <span className="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground cursor-pointer">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-4 border-t border-border-soft py-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">
            © 2026 TatVivah. Crafted with care in India.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <span className="transition-colors duration-300 hover:text-foreground cursor-pointer">
              Privacy Policy
            </span>
            <span className="transition-colors duration-300 hover:text-foreground cursor-pointer">
              Terms of Service
            </span>
            <span className="transition-colors duration-300 hover:text-foreground cursor-pointer">
              Shipping Policy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
