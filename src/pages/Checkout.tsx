import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Loader2,
  Lock,
  ShoppingBag,
} from "lucide-react";
import AppHeader from "../components/site/AppHeader";
import { Button, buttonClasses } from "../components/ui/Button";
import DomainManager from "../components/domain/DomainManager";
import { SiteProjectApi } from "../api/projectsClient";
import { getPackagePlan, PACKAGE_PLANS } from "../lib/packages";
import type { PackageId, SiteProject } from "../types/project";

export default function Checkout() {
  const [params, setParams] = useSearchParams();
  const projectId = params.get("proje");

  const [project, setProject] = useState<SiteProject | null>(null);
  const [allProjects, setAllProjects] = useState<SiteProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<PackageId>("kurumsal");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    if (projectId) {
      SiteProjectApi.get(projectId)
        .then((proj) => {
          if (!active) return;
          setProject(proj);
          const pkg = getPackagePlan(proj.package).id;
          setSelectedPkg(pkg);
        })
        .catch((err) => {
          if (!active) return;
          setError(err instanceof Error ? err.message : "Proje yüklenemedi.");
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    } else {
      SiteProjectApi.list()
        .then((list) => {
          if (!active) return;
          setAllProjects(list);
          if (list.length > 0) {
            setProject(list[0]);
            setSelectedPkg(getPackagePlan(list[0].package).id);
          }
        })
        .catch(() => {})
        .finally(() => {
          if (active) setLoading(false);
        });
    }

    return () => {
      active = false;
    };
  }, [projectId]);

  const activePlan = getPackagePlan(selectedPkg);

  const handleCompletePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    setSubmitting(true);
    setError(null);
    try {
      const updated = await SiteProjectApi.update(project.id, {
        purchased: true,
        package: selectedPkg,
      });
      setProject(updated);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Sipariş tamamlanırken bir sorun oluştu.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyCode = async () => {
    if (!project?.html_code) return;
    await navigator.clipboard.writeText(project.html_code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    if (!project?.html_code) return;
    const slug = (project.title || "code-ai-site")
      .toLowerCase()
      .replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ]+/gi, "-")
      .replace(/^-+|-+$/g, "");
    const blob = new Blob([project.html_code], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug || "index"}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AppHeader />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <div className="mb-6">
          <Link
            to={project ? `/olustur?proje=${project.id}` : "/olustur"}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Oluşturucuya dön
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-24">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : !project ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <h1 className="font-display text-xl font-semibold text-slate-900">
              {error || "Henüz teslim alınacak bir proje seçilmedi"}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Önce oluşturucuda bir web sitesi hazırlayın veya kayıtlı projelerinizden birini seçin.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                to="/olustur"
                className={buttonClasses({ variant: "primary", size: "md" })}
              >
                Yeni Site Oluştur
              </Link>
              <Link
                to="/projeler"
                className={buttonClasses({ variant: "outline", size: "md" })}
              >
                Projelerim
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left column: Selected project, package & Domain management */}
            <div className="space-y-6 lg:col-span-7">
              {!projectId && allProjects.length > 1 && (
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <label className="block text-xs font-medium text-slate-500">
                    Teslim alınacak projeyi seçin
                  </label>
                  <select
                    value={project.id}
                    onChange={(e) => {
                      const next = allProjects.find((p) => p.id === e.target.value);
                      if (next) {
                        setProject(next);
                        setSelectedPkg(getPackagePlan(next.package).id);
                        setParams({ proje: next.id }, { replace: true });
                      }
                    }}
                    className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                  >
                    {allProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-6 py-4">
                  <p className="text-xs text-slate-500">
                    {project.sector || "Web Sitesi Projesi"} · Kaynak Kod Paketi
                  </p>
                  <h1 className="font-display text-2xl font-semibold text-slate-900">
                    {project.title}
                  </h1>
                  {project.summary && (
                    <p className="mt-1 text-sm text-slate-600">{project.summary}</p>
                  )}
                </div>

                <div className="h-72 overflow-hidden bg-slate-100">
                  <iframe
                    title={project.title}
                    srcDoc={project.html_code}
                    sandbox=""
                    className="pointer-events-none h-[760px] w-[1280px] origin-top-left scale-[0.45] border-0 bg-white"
                  />
                </div>
              </div>

              {/* Package selector */}
              {!project.purchased && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h2 className="font-display text-lg font-semibold text-slate-900">
                    Teslimat Paketi Seçimi
                  </h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {PACKAGE_PLANS.map((plan) => {
                      const active = selectedPkg === plan.id;
                      return (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => setSelectedPkg(plan.id)}
                          className={`rounded-xl border p-4 text-left transition-colors cursor-pointer ${
                            active
                              ? "border-blue-600 bg-blue-50/40"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <p className="text-sm font-semibold text-slate-900">{plan.name}</p>
                          <p className="mt-1 font-display text-xl font-semibold text-slate-900 tabular-nums">
                            {plan.priceLabel}
                          </p>
                          <p className="mt-1 text-xs leading-snug text-slate-500">
                            {plan.billingNote}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Custom Domain Panel */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="mb-4">
                  <h2 className="font-display text-lg font-semibold text-slate-900">
                    Alan Adı ve Yayınlama
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Kendi alan adınızı bağlayın ve DNS doğrulama kayıtlarını görüntüleyin.
                  </p>
                </div>
                <DomainManager
                  project={project}
                  onProjectUpdated={(updated) => setProject(updated)}
                />
              </div>
            </div>

            {/* Right column: Checkout or Unlocked Code Delivery */}
            <div className="lg:col-span-5">
              {project.purchased ? (
                <div className="space-y-5 rounded-2xl border border-emerald-200 bg-white p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
                    <div>
                      <h2 className="font-display text-xl font-semibold text-slate-900">
                        Kaynak Kod Teslime Hazır
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">
                        {activePlan.name} paketi aktif edildi. Temiz HTML5 dosyanızı indirebilir veya doğrudan kopyalayabilirsiniz.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 border-t border-slate-200 pt-4">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleDownloadHtml}
                      className="w-full"
                    >
                      <Download className="h-4 w-4" />
                      index.html Olarak İndir
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={handleCopyCode}
                      className="w-full"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-600" />
                          Tüm HTML Kodu Kopyalandı
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Kaynak Kodu Kopyala
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
                    <p className="font-semibold text-slate-800">Hızlı Yayınlama Notu</p>
                    <p className="mt-1">
                      İndirdiğiniz <code className="font-mono text-slate-900">.html</code> dosyasını doğrudan Vercel, Netlify Drop veya mevcut alan adınızın <code className="font-mono text-slate-900">public_html</code> klasörüne yükleyerek yayınlayabilir; sol bölümdeki alan adı panelinden DNS ayarlarınızı takip edebilirsiniz.
                    </p>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleCompletePurchase}
                  className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <div>
                    <h2 className="font-display text-xl font-semibold text-slate-900">
                      Sipariş Özeti
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {activePlan.name} · {activePlan.billingNote}
                    </p>
                  </div>

                  <ul className="space-y-2 border-y border-slate-200 py-4">
                    {activePlan.deliverables.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-slate-700"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700">
                        Ad Soyad / Firma Ünvanı
                      </label>
                      <input
                        required
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Örn: Deniz Yılmaz"
                        className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700">
                        Teslimat E-posta Adresi
                      </label>
                      <input
                        required
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="ornek@firma.com"
                        className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between border-t border-slate-200 pt-4">
                    <span className="text-sm font-medium text-slate-600">
                      Toplam Tutar (KDV Dahil)
                    </span>
                    <span className="font-display text-2xl font-semibold text-slate-900 tabular-nums">
                      {activePlan.priceLabel}
                    </span>
                  </div>

                  {error && (
                    <p className="text-xs font-medium text-red-600">{error}</p>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        İşlem Tamamlanıyor...
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" />
                        Siparişi Tamamla ve Kodu Aç
                      </>
                    )}
                  </Button>

                  <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                    <Lock className="h-3.5 w-3.5" />
                    Onay sonrası kaynak kod anında teslim edilir.
                  </p>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
