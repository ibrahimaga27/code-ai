import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { buttonClasses } from "../ui/Button";

const NAV_ITEMS = [
  { to: "/", label: "Ana Sayfa" },
  { to: "/olustur", label: "Oluşturucu" },
  { to: "/projeler", label: "Projeler" },
  { to: "/#paketler", label: "Paketler" },
];

export default function AppHeader() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to: string) => {
    if (to === "/") return location.pathname === "/";
    if (to === "/olustur") {
      return location.pathname === "/olustur" || location.pathname === "/builder";
    }
    if (to.startsWith("/#")) return false;
    return location.pathname.startsWith(to);
  };

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-8 px-4 sm:px-8">
        {/* Zone 1: Brand wordmark */}
        <Link
          to="/"
          className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
        >
          CODE AI
        </Link>

        {/* Zone 2: Navigation links */}
        <nav
          aria-label="Ana menü"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.to);
            if (item.to.startsWith("/#")) {
              return (
                <a
                  key={item.to}
                  href={item.to}
                  className="whitespace-nowrap shrink-0 py-1 transition-colors hover:text-slate-900 hover:underline underline-offset-4"
                >
                  {item.label}
                </a>
              );
            }
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-slate-900 ${
                  active
                    ? "text-slate-900 underline underline-offset-4 decoration-blue-600 decoration-2"
                    : "hover:underline underline-offset-4"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action + mobile menu button */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/olustur"
            className={buttonClasses({
              variant: "primary",
              size: "sm",
              className: "hidden sm:inline-flex",
            })}
          >
            Site Oluştur
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) =>
              item.to.startsWith("/#") ? (
                <a
                  key={item.to}
                  href={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {item.label}
                </Link>
              ),
            )}
            <Link
              to="/olustur"
              onClick={() => setMobileOpen(false)}
              className={buttonClasses({
                variant: "primary",
                size: "md",
                className: "mt-2 w-full",
              })}
            >
              Site Oluştur
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
