import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Code2, Layers, MessageSquare } from "lucide-react";
import AppHeader from "../components/site/AppHeader";
import { buttonClasses } from "../components/ui/Button";
import { PACKAGE_PLANS } from "../lib/packages";

const SHOWCASE_ITEMS = [
  {
    id: "proj_kuzey_mimarlik",
    category: "Mimarlık · Kurumsal Vitrin",
    title: "Kuzey Mimarlık Stüdyosu",
    description:
      "Seçili yapılar, tasarım süreci adımları ve randevu formuyla yalın stüdyo tanıtımı.",
    image: "/src/assets/images/template_architecture_site_1794820318879.jpg",
    prompt:
      "Çağdaş bir mimarlık ofisi için seçili projeler, tasarım yaklaşımı ve iletişim formu içeren kurumsal web sitesi yap.",
  },
  {
    id: "proj_vespera_kahve",
    category: "Gastronomi · Butik Kafe",
    title: "Vespera Kahve Kavurma Evi",
    description:
      "Günlük demleme seçkisi, fırın menüsü ve çalışma saatlerini öne çıkaran sıcak kafe sayfası.",
    image: "/src/assets/images/template_artisan_cafe_1794820319292.jpg",
    prompt:
      "Nitelikli kahve kavuran ve sabahları kruvasan sunan butik kafe için menü ve adres sayfası oluştur.",
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const [quickPrompt, setQuickPrompt] = useState("");

  const handleStartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = quickPrompt.trim();
    if (trimmed) {
      navigate(`/olustur?prompt=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/olustur");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AppHeader />

      {/* Hero Split */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8 lg:py-20">
        <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col justify-center space-y-6 lg:col-span-6">
            <p className="text-xs font-medium tracking-wide text-slate-500">
              Türkçe Yapay Zeka Web Stüdyosu · Anında Canlı Önizleme
            </p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:leading-[1.08]">
              Sohbet ederek canlı web sitenizi dakikalar içinde kurun.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              İşinizi tek cümleyle anlatın; CODE AI tasarım düzenini, Türkçe metinleri ve duyarlı HTML5 kodunu eş zamanlı üretsin. Beğendiğiniz anda kaynak kodu teslim alın.
            </p>

            <form
              onSubmit={handleStartSubmit}
              className="flex flex-col gap-2.5 rounded-xl border border-slate-200 bg-white p-2 sm:flex-row sm:items-center"
            >
              <input
                type="text"
                value={quickPrompt}
                onChange={(e) => setQuickPrompt(e.target.value)}
                placeholder="Örn: Ankara'da psikolojik danışmanlık merkezi sitesi..."
                className="min-h-11 flex-1 bg-transparent px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className={buttonClasses({ variant: "primary", size: "lg" })}
              >
                Tasarlamaya Başla
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-6 pt-1 text-sm text-slate-500">
              <Link
                to="/projeler"
                className="font-medium text-slate-700 underline underline-offset-4 hover:text-slate-900"
              >
                Kayıtlı projeleri incele
              </Link>
              <span aria-hidden="true">·</span>
              <span>Tek dosya temiz HTML5 çıktısı</span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="h-full min-h-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-200">
              <img
                src="/src/assets/images/hero_design_studio_1794820318459.jpg"
                alt="CODE AI web tasarım stüdyosu çalışma masası"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Overview */}
      <section className="border-y border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="mb-10 max-w-2xl">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Fikirden yayına hazır koda üç net adım
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
              Sürükle-bırak kalıplarıyla vakit kaybetmeden doğrudan sohbet üzerinden marka tonunuza uygun sayfa yapısını kurun.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-2.5 border-t border-slate-200 pt-5">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
                <MessageSquare className="h-4 w-4" />
              </div>
              <h3 className="font-display text-lg font-semibold text-slate-900">
                01. İhtiyacınızı yazın
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Sektörünüzü, hedef kitlenizi ve sitede bulunmasını istediğiniz bölümleri doğal Türkçe ile paylaşın.
              </p>
            </div>

            <div className="space-y-2.5 border-t border-slate-200 pt-5">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
                <Layers className="h-4 w-4" />
              </div>
              <h3 className="font-display text-lg font-semibold text-slate-900">
                02. Canlı önizlemede iyileştirin
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Masaüstü, tablet ve mobil görünümleri anlık kontrol edin; renkleri, başlıkları veya ek bölümleri sohbetten güncelleyin.
              </p>
            </div>

            <div className="space-y-2.5 border-t border-slate-200 pt-5">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
                <Code2 className="h-4 w-4" />
              </div>
              <h3 className="font-display text-lg font-semibold text-slate-900">
                03. Kaynak kodu teslim alın
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Paketinizi seçip tek tıkla bağımsız HTML dosyasını indirin ve dilediğiniz sunucuda hemen yayınlayın.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Projects / Starter Showcase */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Örnek stüdyo çıktıları
            </h2>
            <p className="mt-1.5 text-sm text-slate-600">
              Hazır bir projeyi düzenleyiciye açabilir veya kendi briefinizle sıfırdan başlayabilirsiniz.
            </p>
          </div>
          <Link
            to="/projeler"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline underline-offset-4"
          >
            Tüm projeleri gör
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {SHOWCASE_ITEMS.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-3 p-6">
                <p className="text-xs font-medium text-slate-500">{item.category}</p>
                <h3 className="font-display text-xl font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    to={`/olustur?proje=${item.id}`}
                    className={buttonClasses({ variant: "secondary", size: "sm" })}
                  >
                    Önizlemeyi Düzenle
                  </Link>
                  <Link
                    to={`/olustur?prompt=${encodeURIComponent(item.prompt)}`}
                    className="text-xs font-medium text-slate-600 hover:text-slate-900 underline underline-offset-4"
                  >
                    Benzerini sıfırdan üret
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section id="paketler" className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="mb-10 max-w-2xl">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Şeffaf teslimat paketleri
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Oluşturucuyu ücretsiz deneyin; yalnızca kodunuzu indirip yayınlamaya hazır olduğunuzda paketinizi seçin.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {PACKAGE_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`flex flex-col justify-between rounded-2xl border p-6 ${
                  plan.highlighted
                    ? "border-blue-600 bg-blue-50/20"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl font-semibold text-slate-900">
                      {plan.name}
                    </h3>
                    {plan.highlighted && (
                      <span className="text-xs font-semibold text-blue-600">
                        En Çok Tercih Edilen
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm text-slate-600">{plan.audience}</p>
                  <div className="mt-5 border-b border-slate-200 pb-5">
                    <p className="font-display text-3xl font-semibold text-slate-900 tabular-nums">
                      {plan.priceLabel}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{plan.billingNote}</p>
                  </div>
                  <ul className="mt-5 space-y-3">
                    {plan.deliverables.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={`/olustur?paket=${plan.id}`}
                  className={buttonClasses({
                    variant: plan.highlighted ? "primary" : "outline",
                    size: "md",
                    className: "mt-8 w-full",
                  })}
                >
                  {plan.name} ile Başla
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50 py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 text-xs text-slate-500 sm:px-8">
          <span>CODE AI · Yapay Zeka Web Sitesi Oluşturucu</span>
          <div className="flex items-center gap-5">
            <Link to="/olustur" className="hover:text-slate-900">
              Oluşturucu
            </Link>
            <Link to="/projeler" className="hover:text-slate-900">
              Projeler
            </Link>
            <Link to="/odeme" className="hover:text-slate-900">
              Kod Teslimatı
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
