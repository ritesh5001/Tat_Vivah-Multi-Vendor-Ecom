"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const buyerLinks = [
  { href: "/marketplace", label: "Shop" },
  { href: "/#categories", label: "Categories" },
  { href: "/#bestsellers", label: "Bestsellers" },
  { href: "/#new", label: "New" },
  { href: "/#gifting", label: "Gifting" },
  { href: "/vendors", label: "Vendors" },
  { href: "/cart", label: "Cart" },
];

const sellerLinks = [
  { href: "/seller/dashboard", label: "Overview" },
  { href: "/seller/orders", label: "Orders" },
  { href: "/seller/products", label: "Products" },
  { href: "/seller/analytics", label: "Analytics" },
  { href: "/seller/payouts", label: "Payouts" },
  { href: "/seller/profile", label: "Profile" },
];

const adminLinks = [
  { href: "/admin/dashboard", label: "Overview" },
  { href: "/admin/sellers", label: "Sellers" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/security", label: "Security" },
  { href: "/admin/profile", label: "Profile" },
];

export function SiteHeader() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [user, setUser] = React.useState<{
    email?: string | null;
    phone?: string | null;
    role?: string | null;
  } | null>(null);

  React.useEffect(() => {
    const getCookie = (name: string) => {
      const match = document.cookie.match(
        new RegExp(
          `(?:^|; )${name.replace(/([.$?*|{}()\[\]\\/+^])/g, "\\$1")}=([^;]*)`
        )
      );
      return match ? decodeURIComponent(match[1]) : undefined;
    };

    const syncUser = () => {
      const storedUser = getCookie("tatvivah_user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
        return;
      }
      setUser(null);
    };

    syncUser();

    const handleAuthChange = () => syncUser();
    window.addEventListener("tatvivah-auth", handleAuthChange);

    return () => {
      window.removeEventListener("tatvivah-auth", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    document.cookie = "tatvivah_access=; path=/; max-age=0";
    document.cookie = "tatvivah_role=; path=/; max-age=0";
    document.cookie = "tatvivah_user=; path=/; max-age=0";
    setUser(null);
    setMenuOpen(false);
    router.push("/login");
  };

  const displayName = user?.email ?? user?.phone ?? "Account";
  const initial = displayName?.charAt(0)?.toUpperCase() ?? "A";
  const role = user?.role?.toUpperCase();
  const profileLink = React.useMemo(() => {
    if (role === "SELLER") {
      return "/seller/profile";
    }
    if (role === "ADMIN") {
      return "/admin/profile";
    }
    return "/user/profile";
  }, [role]);
  const navLinks = React.useMemo(() => {
    if (!user) {
      return buyerLinks;
    }

    if (role === "SELLER") {
      return sellerLinks;
    }

    if (role === "ADMIN") {
      return adminLinks;
    }

    return [
      ...buyerLinks,
      { href: "/user/dashboard", label: "Dashboard" },
      { href: "/user/orders", label: "Orders" },
    ];
  }, [role, user]);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/70 backdrop-blur dark:border-slate-800/60 dark:bg-slate-950/70">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-fuchsia-600 text-white shadow-lg shadow-rose-500/30">
            <span className="text-lg font-semibold">T</span>
          </div>
          <div className="leading-tight">
            <p className="text-base font-semibold text-slate-900 dark:text-white">
              TatVivah
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Multi-vendor fashion
            </p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-rose-600 dark:hover:text-rose-400"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle className="hidden sm:inline-flex" />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-rose-200 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 sm:hidden"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="text-lg">☰</span>
          </button>
          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {displayName}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    aria-label="Account menu"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-fuchsia-600 text-white">
                      {initial}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={profileLink}>My profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/login?force=1">Switch account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link href="/login" className="hidden sm:inline-flex">
              <Button size="sm">Get started</Button>
            </Link>
          )}
        </div>
      </div>
      {menuOpen ? (
        <div className="border-t border-slate-200/70 bg-white/95 px-6 py-4 backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/95 sm:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:text-rose-600 dark:border-slate-700 dark:text-slate-200"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-2.5 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-fuchsia-600 text-white">
                  {initial}
                </span>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {displayName}
                </div>
              </div>
              <ThemeToggle />
            </div>
            {user ? (
              <div className="grid gap-2">
                <Link
                  href={profileLink}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:text-rose-600 dark:border-slate-700 dark:text-slate-200"
                  onClick={() => setMenuOpen(false)}
                >
                  My profile
                </Link>
                <Link
                  href="/login?force=1"
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:text-rose-600 dark:border-slate-700 dark:text-slate-200"
                  onClick={() => setMenuOpen(false)}
                >
                  Switch account
                </Link>
                <Button size="sm" variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                <Button size="sm" className="w-full">
                  Get started
                </Button>
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
