import type { PackageId } from "../types/project";

export interface PackagePlan {
  id: PackageId;
  name: string;
  audience: string;
  priceTRY: number;
  priceLabel: string;
  billingNote: string;
  deliverables: string[];
  highlighted?: boolean;
}

export const PACKAGE_PLANS: PackagePlan[] = [
  {
    id: "baslangic",
    name: "Başlangıç",
    audience: "Kişisel marka ve tek sayfalık tanıtımlar için",
    priceTRY: 790,
    priceLabel: "790 ₺",
    billingNote: "Tek seferlik kaynak kod teslimi",
    deliverables: [
      "Tek sayfa duyarlı HTML5 kaynak kodu",
      "Mobil, tablet ve masaüstü uyumlu ızgara",
      "Anında indirilebilir .html paketi",
      "Sınırsız sohbet içi revizyon",
    ],
  },
  {
    id: "kurumsal",
    name: "Kurumsal",
    audience: "Ajanslar, klinikler, stüdyolar ve KOBİ'ler için",
    priceTRY: 1490,
    priceLabel: "1.490 ₺",
    billingNote: "Tek seferlik ticari lisans ve tam kod",
    highlighted: true,
    deliverables: [
      "Çok bölümlü kurumsal HTML5 + Tailwind kodu",
      "SEO meta etiketleri ve OpenGraph yapısı",
      "Etkileşimli iletişim ve teklif formu kurgusu",
      "Ticari kullanım hakkı ve yayınlama rehberi",
    ],
  },
  {
    id: "ozel",
    name: "Özel Stüdyo",
    audience: "Çok dilli veya özel kampanya sayfaları için",
    priceTRY: 2690,
    priceLabel: "2.690 ₺",
    billingNote: "Tek seferlik tam proje hakları",
    deliverables: [
      "Özel bileşen ve etkileşimli fiyat hesaplayıcılar",
      "Sınırsız revizyon ve proje arşivi saklama",
      "Yüksek dönüşüm odaklı iniş sayfası mimarisi",
      "Öncelikli üretim ve kurulum dokümantasyonu",
    ],
  },
];

export function getPackagePlan(id?: string | null): PackagePlan {
  return PACKAGE_PLANS.find((plan) => plan.id === id) ?? PACKAGE_PLANS[1];
}
