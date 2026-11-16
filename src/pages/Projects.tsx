import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Globe, Plus, Search, ShoppingBag, Trash2 } from "lucide-react";
import AppHeader from "../components/site/AppHeader";
import { buttonClasses } from "../components/ui/Button";
import { SiteProjectApi } from "../api/projectsClient";
import { getPackagePlan } from "../lib/packages";
import type { SiteProject } from "../types/project";

type FilterStatus = "all" | "purchased" | "draft";

export default function Projects() {
  const [projects, setProjects] = useState<SiteProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await SiteProjectApi.list();
      setProjects(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Projeler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((proj) => {
      if (filter === "purchased" && !proj.purchased) return false;
      if (filter === "draft" && proj.purchased) return false;
      if (!q) return true;
      const domainMatch = (proj.domains || []).some((d) =>
        d.domain.toLowerCase().includes(q),
      );
      return (
        proj.title.toLowerCase().includes(q) ||
        proj.sector.toLowerCase().includes(q) ||
        proj.summary.toLowerCase().includes(q) ||
        domainMatch
      );
    });
  }, [projects, query, filter]);

  const handleDelete = async (id: string) => {
    try {
      await SiteProjectApi.remove(id);
      setProjects((prev) => prev.filter((item) => item.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Proje silinemedi.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Kayıtlı Projeler
            </h1>
            <p className="mt-1.5 text-sm text-slate-600">
              Oluşturduğunuz tüm web sitelerini düzenleyiciye geri açabilir, alan adı bağlayabilir veya kaynak kodunu teslim alabilirsiniz.
            </p>
          </div>
          <Link to="/olustur" className={buttonClasses({ variant: "primary", size: "md" })}>
            <Plus className="h-4 w-4" />
            Yeni Site Oluştur
          </Link>
        </div>

        {/* Search and Filter Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Proje adı, sektör veya alan adı ara..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="inline-flex items-center gap-1 rounded-lg bg-slate-200/70 p-1">
            {(
              [
                { id: "all", label: "Tümü" },
                { id: "purchased", label: "Kodu Açılanlar" },
                { id: "draft", label: "Taslaklar" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  filter === tab.id
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="h-32 rounded-lg bg-slate-100" />
                <div className="mt-4 h-4 w-2/3 rounded bg-slate-100" />
                <div className="mt-2 h-3 w-full rounded bg-slate-100" />
                <div className="mt-6 h-9 w-1/2 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <h2 className="font-display text-lg font-semibold text-slate-900">
              {projects.length === 0
                ? "Henüz kayıtlı bir proje bulunmuyor"
                : "Aramanızla eşleşen proje bulunamadı"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {projects.length === 0
                ? "Oluşturucuda ilk web sitenizi tarif ettiğinizde otomatik olarak burada listelenir."
                : "Farklı bir arama terimi veya filtre seçerek tekrar deneyebilirsiniz."}
            </p>
            <div className="mt-6">
              <Link
                to="/olustur"
                className={buttonClasses({ variant: "primary", size: "md" })}
              >
                İlk Siteni Oluştur
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((proj) => {
              const plan = getPackagePlan(proj.package);
              const primaryDomain = proj.domains?.[0];
              const dateLabel = new Date(proj.updated_at).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <article
                  key={proj.id}
                  className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <div>
                    {/* Scaled miniature preview */}
                    <div className="relative h-44 overflow-hidden border-b border-slate-200 bg-slate-100">
                      <iframe
                        title={proj.title}
                        srcDoc={proj.html_code}
                        sandbox=""
                        tabIndex={-1}
                        className="pointer-events-none h-[720px] w-[1280px] origin-top-left scale-[0.3] border-0 bg-white"
                      />
                    </div>

                    <div className="space-y-2 p-5">
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                        <span>{proj.sector || "Genel"}</span>
                        <span aria-hidden="true">·</span>
                        <span>{plan.name}</span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={
                            proj.purchased
                              ? "font-medium text-emerald-700"
                              : "text-slate-500"
                          }
                        >
                          {proj.purchased ? "Kod Açık" : "Taslak"}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{dateLabel}</span>
                      </div>

                      <h2 className="font-display text-lg font-semibold text-slate-900 truncate">
                        {proj.title}
                      </h2>
                      <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
                        {proj.summary || proj.brief}
                      </p>

                      <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                        {primaryDomain ? (
                          <span className="inline-flex items-center gap-1.5 font-mono text-slate-700 truncate">
                            <Globe className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                            {primaryDomain.domain}
                          </span>
                        ) : (
                          <span className="text-slate-400">Alan adı bağlı değil</span>
                        )}
                        <a
                          href={`/site/${proj.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 font-medium text-blue-600 hover:underline"
                        >
                          Canlı Gör
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/olustur?proje=${proj.id}`}
                        className={buttonClasses({ variant: "outline", size: "sm" })}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Düzenle
                      </Link>
                      <Link
                        to={`/odeme?proje=${proj.id}`}
                        className={buttonClasses({
                          variant: proj.purchased ? "secondary" : "primary",
                          size: "sm",
                        })}
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        {proj.purchased ? "Kodu Al" : "Satın Al"}
                      </Link>
                    </div>

                    {confirmDeleteId === proj.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDelete(proj.id)}
                          className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700 cursor-pointer"
                        >
                          Sil
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="rounded-md px-2 py-1 text-xs text-slate-500 hover:text-slate-900 cursor-pointer"
                        >
                          Vazgeç
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(proj.id)}
                        aria-label={`${proj.title} projesini sil`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
