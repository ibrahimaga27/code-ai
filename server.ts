import "dotenv/config";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import dns from "node:dns/promises";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface CustomDomainRecord {
  domain: string;
  status: "pending" | "verified";
  verification_token: string;
  ssl_enabled: boolean;
  added_at: string;
  verified_at: string | null;
  last_checked_at?: string | null;
  last_check_note?: string | null;
}

interface SiteProjectRecord {
  id: string;
  title: string;
  sector: string;
  summary: string;
  html_code: string;
  brief: string;
  package: string;
  messages: ChatMessage[];
  domains: CustomDomainRecord[];
  purchased: boolean;
  purchased_at: string | null;
  created_at: string;
  updated_at: string;
}

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(process.cwd(), ".data");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const TARGET_A_IP = "76.76.21.21";
const TARGET_CNAME = "cname.codeai.site";

const SEED_PROJECTS: SiteProjectRecord[] = [
  {
    id: "proj_kuzey_mimarlik",
    title: "Kuzey Mimarlık Stüdyosu",
    sector: "Mimarlık & İç Mekan",
    summary: "Doğal ışık ve yalın malzeme odaklı çağdaş mimarlık ofisi vitrini.",
    brief: "İstanbul merkezli çağdaş bir mimarlık stüdyosu için kurumsal portfolyo ve randevu sitesi.",
    package: "kurumsal",
    purchased: false,
    purchased_at: null,
    created_at: "2026-11-10T09:30:00.000Z",
    updated_at: "2026-11-10T09:30:00.000Z",
    domains: [],
    messages: [
      {
        role: "assistant",
        content:
          "Merhaba, ben CODE AI. Nasıl bir site istediğini anlat: kim için, ne iş yapıyorsun ve hangi bölümler olsun? Tek cümleyle başlayabilirsin, eksikleri ben sorarım.",
      },
      {
        role: "user",
        content:
          "İstanbul merkezli çağdaş bir mimarlık stüdyosu için sade ve güven veren bir tanıtım sitesi oluştur.",
      },
      {
        role: "assistant",
        content:
          "Kuzey Mimarlık Stüdyosu için yalın tipografiye sahip, proje seçkisi, tasarım süreci ve iletişim formu içeren kurumsal web sitesini hazırladım. Renk tonu veya proje listesinde değişiklik ister misin?",
      },
    ],
    html_code: `<!doctype html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kuzey Mimarlık Stüdyosu</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    h1, h2, h3 { font-family: 'Outfit', sans-serif; }
  </style>
</head>
<body class="bg-stone-50 text-stone-900 antialiased">
  <header class="border-b border-stone-200 bg-stone-50/90 backdrop-blur sticky top-0 z-20">
    <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <a href="#" class="text-lg font-semibold tracking-tight">Kuzey Mimarlık</a>
      <nav class="hidden md:flex items-center gap-8 text-sm text-stone-600">
        <a href="#projeler" class="hover:text-stone-900 transition">Projeler</a>
        <a href="#yaklasim" class="hover:text-stone-900 transition">Yaklaşım</a>
        <a href="#iletisim" class="hover:text-stone-900 transition">İletişim</a>
      </nav>
      <a href="#iletisim" class="px-4 py-2 bg-stone-900 text-stone-50 text-sm font-medium rounded-lg hover:bg-stone-800 transition">Görüşme Planla</a>
    </div>
  </header>

  <main>
    <section class="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-7 space-y-6">
        <p class="text-xs uppercase tracking-widest text-stone-500 font-medium">İstanbul · Konut & Ticari Yapılar</p>
        <h1 class="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.1] text-stone-900">Işık, oran ve kalıcı malzemeyle şekillenen mekanlar.</h1>
        <p class="text-lg text-stone-600 max-w-xl leading-relaxed">Konut, kültür yapıları ve çalışma alanlarında bağlama saygılı, enerji verimli ve zamansız mimari projeler tasarlıyoruz.</p>
        <div class="flex flex-wrap gap-3 pt-2">
          <a href="#projeler" class="px-5 py-3 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 transition">Seçili Projeleri İncele</a>
          <a href="#yaklasim" class="px-5 py-3 border border-stone-300 text-stone-800 text-sm font-medium rounded-lg hover:bg-stone-100 transition">Tasarım Sürecimiz</a>
        </div>
      </div>
      <div class="lg:col-span-5">
        <div class="aspect-[4/5] rounded-2xl bg-stone-200 border border-stone-300 overflow-hidden p-8 flex flex-col justify-between bg-gradient-to-br from-stone-200 via-stone-100 to-stone-300">
          <svg viewBox="0 0 240 180" class="w-full h-auto text-stone-700" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="20" y="30" width="200" height="120" rx="2" />
            <line x1="20" y1="80" x2="220" y2="80" />
            <line x1="95" y1="30" x2="95" y2="150" />
            <line x1="160" y1="80" x2="160" y2="150" />
            <circle cx="58" cy="55" r="12" />
          </svg>
          <div>
            <p class="text-xs text-stone-500">Öne Çıkan Yapı · 2026</p>
            <p class="text-lg font-semibold text-stone-900 mt-1">Büyükada Taş Avlu Evi</p>
            <p class="text-sm text-stone-600 mt-1">420 m² · Pasif İklimlendirme</p>
          </div>
        </div>
      </div>
    </section>

    <section id="projeler" class="border-t border-stone-200 bg-white py-20">
      <div class="max-w-6xl mx-auto px-6">
        <div class="mb-10">
          <h2 class="text-2xl sm:text-3xl font-semibold">Seçili Projeler</h2>
          <p class="text-stone-600 mt-2">Konsept aşamasından şantiye teslimine kadar yönettiğimiz yapılar.</p>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          <article class="border border-stone-200 rounded-xl p-6 bg-stone-50/50">
            <p class="text-xs text-stone-500">01 · Konut · Bebek</p>
            <h3 class="text-xl font-semibold mt-2">Boğaz Teras Yenilemesi</h3>
            <p class="text-sm text-stone-600 mt-2 leading-relaxed">Doğal meşe doğramalar ve gizli akustik panellerle dönüştürülen 280 m² yaşam alanı.</p>
          </article>
          <article class="border border-stone-200 rounded-xl p-6 bg-stone-50/50">
            <p class="text-xs text-stone-500">02 · Ofis · Karaköy</p>
            <h3 class="text-xl font-semibold mt-2">Liman Stüdyo Hub</h3>
            <p class="text-sm text-stone-600 mt-2 leading-relaxed">Tarihi taş yapıda modüler toplantı kabinleri ve gün ışığı galerisi kurgusu.</p>
          </article>
          <article class="border border-stone-200 rounded-xl p-6 bg-stone-50/50">
            <p class="text-xs text-stone-500">03 · Kültür · Urla</p>
            <h3 class="text-xl font-semibold mt-2">Bağ Evi & Sergi Mekanı</h3>
            <p class="text-sm text-stone-600 mt-2 leading-relaxed">Yerel kalker taşı ve güneş kırıcı ahşap pergolalarla bütünleşen kamusal avlu.</p>
          </article>
        </div>
      </div>
    </section>

    <section id="yaklasim" class="max-w-6xl mx-auto px-6 py-20">
      <h2 class="text-2xl sm:text-3xl font-semibold mb-8">Üç Adımda Tasarım Süreci</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div>
          <p class="text-sm font-semibold text-stone-900">01. Arazi & İhtiyaç Analizi</p>
          <p class="text-sm text-stone-600 mt-2 leading-relaxed">Güneş yönelimi, rüzgar koridorları ve kullanıcı senaryoları yerinde etüt edilir.</p>
        </div>
        <div>
          <p class="text-sm font-semibold text-stone-900">02. Malzeme & Detay Projesi</p>
          <p class="text-sm text-stone-600 mt-2 leading-relaxed">Bire bir numuneler ve 3 boyutlu kesitlerle tüm imalat detayları kesinleştirilir.</p>
        </div>
        <div>
          <p class="text-sm font-semibold text-stone-900">03. Uygulama & Kontrollük</p>
          <p class="text-sm text-stone-600 mt-2 leading-relaxed">Şantiye takvimi, bütçe ve ustalık kalitesi teslim gününe kadar denetlenir.</p>
        </div>
      </div>
    </section>

    <section id="iletisim" class="border-t border-stone-200 bg-white py-20">
      <div class="max-w-3xl mx-auto px-6">
        <h2 class="text-2xl sm:text-3xl font-semibold">Projenizi Konuşalım</h2>
        <p class="text-stone-600 mt-2">Kısa bir ön bilgi bırakın, 24 saat içinde stüdyo randevusu için dönüş yapalım.</p>
        <form onsubmit="event.preventDefault(); document.getElementById('msg').classList.remove('hidden'); this.reset();" class="mt-8 grid sm:grid-cols-2 gap-4">
          <input required type="text" placeholder="Adınız Soyadınız" class="px-4 py-3 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-stone-900" />
          <input required type="email" placeholder="E-posta adresiniz" class="px-4 py-3 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-stone-900" />
          <textarea required rows="3" placeholder="Proje türü, konum ve tahmini alan (m²)" class="sm:col-span-2 px-4 py-3 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-stone-900"></textarea>
          <button type="submit" class="sm:col-span-2 py-3 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 transition">Talebi Gönder</button>
        </form>
        <p id="msg" class="hidden mt-4 text-sm text-emerald-700 font-medium">Talebiniz alındı. Stüdyo ekibimiz en kısa sürede dönüş yapacaktır.</p>
      </div>
    </section>
  </main>

  <footer class="border-t border-stone-200 py-8 text-center text-xs text-stone-500">
    © 2026 Kuzey Mimarlık Stüdyosu · Teşvikiye, İstanbul
  </footer>
</body>
</html>`,
  },
  {
    id: "proj_vespera_kahve",
    title: "Vespera Kahve Kavurma Evi",
    sector: "Gastronomi & Kafe",
    summary: "Nitelikli kahve çekirdekleri ve günlük fırın menüsü sunan butik kafe.",
    brief: "Kadıköy'de nitelikli kahve ve günlük artizan kruvasan sunan butik kafe için web sitesi.",
    package: "baslangic",
    purchased: true,
    purchased_at: "2026-11-12T14:15:00.000Z",
    created_at: "2026-11-12T13:45:00.000Z",
    updated_at: "2026-11-12T14:15:00.000Z",
    domains: [
      {
        domain: "vesperakahve.com",
        status: "pending",
        verification_token: "codeai-verify=vespera9f2a",
        ssl_enabled: true,
        added_at: "2026-11-12T14:20:00.000Z",
        verified_at: null,
        last_checked_at: null,
        last_check_note: null,
      },
    ],
    messages: [
      {
        role: "assistant",
        content:
          "Merhaba, ben CODE AI. Nasıl bir site istediğini anlat: kim için, ne iş yapıyorsun ve hangi bölümler olsun? Tek cümleyle başlayabilirsin, eksikleri ben sorarım.",
      },
      {
        role: "user",
        content:
          "Kadıköy Moda'da nitelikli kahve kavuran ve sabahları taze kruvasan çıkaran sıcak bir kafe sitesi yap.",
      },
      {
        role: "assistant",
        content:
          "Vespera Kahve Kavurma Evi için menü, haftalık kavurma takvimi ve konum saatlerini içeren siteyi oluşturdum.",
      },
    ],
    html_code: `<!doctype html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vespera Kahve Kavurma Evi</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    h1, h2, h3 { font-family: 'Cormorant Garamond', serif; }
  </style>
</head>
<body class="bg-[#FAF7F2] text-[#231F1D] antialiased">
  <header class="border-b border-[#E7DFD3]">
    <div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
      <span class="text-2xl font-bold tracking-tight">Vespera</span>
      <nav class="flex items-center gap-6 text-sm text-[#645A52]">
        <a href="#menu" class="hover:text-[#231F1D]">Menü</a>
        <a href="#cekirdekler" class="hover:text-[#231F1D]">Çekirdekler</a>
        <a href="#ziyaret" class="hover:text-[#231F1D]">Saatler & Adres</a>
      </nav>
    </div>
  </header>
  <main>
    <section class="max-w-5xl mx-auto px-6 py-20 text-center space-y-6">
      <p class="text-xs uppercase tracking-[0.2em] text-[#7D6E63]">Moda · Kadıköy · 2021'den Beri</p>
      <h1 class="text-5xl sm:text-6xl font-bold leading-tight max-w-3xl mx-auto">Her sabah taze kavrulan çekirdekler, taş fırından çıkan hamur işleri.</h1>
      <p class="text-base text-[#5E544C] max-w-xl mx-auto">Küçük partiler halinde kavurduğumuz tek kökenli kahveleri demliyor, gün doğumunda tereyağlı kruvasanlarımızı çıkarıyoruz.</p>
      <div class="pt-2">
        <a href="#menu" class="inline-block px-6 py-3 bg-[#231F1D] text-[#FAF7F2] text-sm font-medium rounded-lg hover:bg-[#3A332F] transition">Günlük Menüyü Gör</a>
      </div>
    </section>
    <section id="menu" class="max-w-5xl mx-auto px-6 py-16 border-t border-[#E7DFD3]">
      <h2 class="text-3xl font-bold mb-8">Demleme & Fırın Seçkisi</h2>
      <div class="grid md:grid-cols-2 gap-8">
        <div class="space-y-4">
          <div class="flex justify-between border-b border-[#E7DFD3] pb-3">
            <div><p class="font-medium">V60 Pour-Over (Etiyopya Guji)</p><p class="text-xs text-[#7D6E63]">Bergamot, beyaz şeftali, yasemin</p></div>
            <span class="font-medium">165 ₺</span>
          </div>
          <div class="flex justify-between border-b border-[#E7DFD3] pb-3">
            <div><p class="font-medium">Flat White</p><p class="text-xs text-[#7D6E63]">Çift ristretto, ipeksi mikro köpük</p></div>
            <span class="font-medium">145 ₺</span>
          </div>
          <div class="flex justify-between border-b border-[#E7DFD3] pb-3">
            <div><p class="font-medium">Soğuk Demleme (18 Saat)</p><p class="text-xs text-[#7D6E63]">Bitter çikolata ve karamel notaları</p></div>
            <span class="font-medium">155 ₺</span>
          </div>
        </div>
        <div class="space-y-4">
          <div class="flex justify-between border-b border-[#E7DFD3] pb-3">
            <div><p class="font-medium">Klasik Tereyağlı Kruvasan</p><p class="text-xs text-[#7D6E63]">72 saat soğuk fermantasyon</p></div>
            <span class="font-medium">130 ₺</span>
          </div>
          <div class="flex justify-between border-b border-[#E7DFD3] pb-3">
            <div><p class="font-medium">Badem Kremalı Brioche</p><p class="text-xs text-[#7D6E63]">Kavrulmuş file badem ve portakal kabuğu</p></div>
            <span class="font-medium">150 ₺</span>
          </div>
          <div class="flex justify-between border-b border-[#E7DFD3] pb-3">
            <div><p class="font-medium">Kakuleli Çörek</p><p class="text-xs text-[#7D6E63]">Taze çekilmiş yeşil kakule</p></div>
            <span class="font-medium">120 ₺</span>
          </div>
        </div>
      </div>
    </section>
    <section id="cekirdekler" class="bg-[#F2ECE1] py-16">
      <div class="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        <div class="max-w-lg">
          <h2 class="text-3xl font-bold">Evde Demlemek İçin 250g Paketler</h2>
          <p class="text-sm text-[#5E544C] mt-3 leading-relaxed">Her Salı ve Cuma kavrulan taze çekirdeklerimizi öğütülmüş veya çekirdek halinde tezgahtan alabilirsiniz.</p>
        </div>
        <div id="ziyaret" class="bg-[#FAF7F2] border border-[#E7DFD3] rounded-xl p-6 text-sm space-y-2 w-full md:w-80">
          <p class="font-semibold">Caferağa Mah. Moda Cad. No:48/B</p>
          <p class="text-[#645A52]">Hafta içi: 08:00 – 21:00</p>
          <p class="text-[#645A52]">Hafta sonu: 09:00 – 22:00</p>
        </div>
      </div>
    </section>
  </main>
  <footer class="py-8 text-center text-xs text-[#7D6E63]">Vespera Kahve Kavurma Evi · Kadıköy</footer>
</body>
</html>`,
  },
];

function normalizeProject(raw: SiteProjectRecord): SiteProjectRecord {
  return {
    ...raw,
    domains: Array.isArray(raw.domains) ? raw.domains : [],
    messages: Array.isArray(raw.messages) ? raw.messages : [],
  };
}

function ensureStore(): SiteProjectRecord[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(PROJECTS_FILE)) {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(SEED_PROJECTS, null, 2), "utf-8");
    return SEED_PROJECTS.map(normalizeProject);
  }
  try {
    const raw = fs.readFileSync(PROJECTS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.map(normalizeProject)
      : SEED_PROJECTS.map(normalizeProject);
  } catch {
    return SEED_PROJECTS.map(normalizeProject);
  }
}

function saveStore(projects: SiteProjectRecord[]): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), "utf-8");
}

function normalizeDomainInput(raw: string): string | null {
  let cleaned = String(raw || "").trim().toLowerCase();
  cleaned = cleaned.replace(/^https?:\/\//, "");
  cleaned = cleaned.split("/")[0]?.split("?")[0]?.split("#")[0] || "";
  cleaned = cleaned.replace(/\.+$/, "");
  const domainRegex = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))+$/;
  if (!domainRegex.test(cleaned) || cleaned.length > 253) {
    return null;
  }
  return cleaned;
}

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY ortam değişkeni tanımlı değil.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const BUILDER_SYSTEM_INSTRUCTION = `Sen CODE AI'sın: Türkçe konuşan, deneyimli bir web tasarımcısı ve frontend geliştiricisin.
Kullanıcının isteğine göre eksiksiz, tek dosyada çalışan, duyarlı (responsive) ve modern bir HTML5 web sitesi üretir veya mevcut siteyi güncellersin.

KURALLAR:
1. Kullanıcının mesajında herhangi bir web sitesi fikri, sektör, marka veya düzenleme isteği varsa HEMEN çalışan HTML5 kodu üret ("ready": true).
2. Sadece hiçbir site fikri içermeyen selamlama ("Merhaba", "Selam") geldiğinde "ready": false ver ve kullanıcıya ne sitesi istediğini kısaca sor.
3. "Mevcut HTML Kodu" verilmişse, kullanıcının yeni talebini mevcut tasarıma uygulayıp TAM güncel HTML belgesini döndür.
4. HTML kuralları:
   - Eksiksiz <!doctype html><html lang="tr">...</html> belgesi olsun.
   - <script src="https://cdn.tailwindcss.com"></script> ve Google Fonts (Outfit / Plus Jakarta Sans) ekle.
   - Dış görsel URL'si (unsplash.com, picsum.photos vb.) KULLANMA; temiz inline SVG grafikleri, CSS gradyanları ve tipografik kartlar kullan.
   - Etkileşimli menü/form gibi öğeler için kısa vanilla JS ekleyebilirsin.
   - Hız ve okunabilirlik için kodu özlü, modern ve yaklaşık 150-220 satır aralığında tut; gereksiz uzun tekrarlar ve devasa SVG kodları yazma.

YANIT FORMATI (KESİNLİKLE BU AYRAÇLARI KULLAN, BAŞKA AÇIKLAMA EKLEME):
<<<META>>>
{"reply":"Kullanıcıya 1-2 cümlelik Türkçe özet ve varsa kısa geliştirme sorusu","ready":true,"title":"Kısa Site Başlığı","sector":"Sektör","summary":"Tek cümlelik site özeti"}
<<<END_META>>>
<<<HTML>>>
<!doctype html>
...tam HTML kodu (markdown kod bloğu olmadan)...
</html>
<<<END_HTML>>>

Eğer ready false ise <<<HTML>>> bloğunu boş bırak: <<<HTML>>><<<END_HTML>>>.`;

function stripCodeFences(text: string): string {
  return text
    .replace(/^```(?:html|json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function parseBuilderOutput(rawText: string) {
  let reply = "Siteyi hazırladım. Değiştirmek istediğin bir bölüm var mı?";
  let ready = false;
  let title = "Yeni site";
  let sector = "";
  let summary = "";
  let html = "";

  const metaMatch = rawText.match(/<<<META>>>([\s\S]*?)<<<END_META>>>/i);
  if (metaMatch && metaMatch[1]) {
    try {
      const metaJson = JSON.parse(stripCodeFences(metaMatch[1]));
      if (typeof metaJson.reply === "string" && metaJson.reply.trim()) {
        reply = metaJson.reply.trim();
      }
      if (typeof metaJson.ready === "boolean") {
        ready = metaJson.ready;
      }
      if (typeof metaJson.title === "string" && metaJson.title.trim()) {
        title = metaJson.title.trim();
      }
      if (typeof metaJson.sector === "string") {
        sector = metaJson.sector.trim();
      }
      if (typeof metaJson.summary === "string") {
        summary = metaJson.summary.trim();
      }
    } catch {
      // Fallback handled below
    }
  }

  const htmlMatch = rawText.match(/<<<HTML>>>([\s\S]*?)<<<END_HTML>>>/i);
  if (htmlMatch && htmlMatch[1]) {
    html = stripCodeFences(htmlMatch[1]);
  } else {
    // Fallback: look for <!doctype html or <html directly in raw output
    const docIdx = rawText.search(/<!doctype\s+html|<html[\s>]/i);
    if (docIdx !== -1) {
      const endIdx = rawText.search(/<\/html>/i);
      const sliced =
        endIdx !== -1 ? rawText.slice(docIdx, endIdx + 7) : rawText.slice(docIdx);
      html = stripCodeFences(sliced);
    }
  }

  // Fallback if model returned pure JSON without delimiters
  if (!metaMatch && !html) {
    try {
      const asJson = JSON.parse(stripCodeFences(rawText));
      if (typeof asJson.reply === "string") reply = asJson.reply;
      if (typeof asJson.title === "string") title = asJson.title;
      if (typeof asJson.sector === "string") sector = asJson.sector;
      if (typeof asJson.summary === "string") summary = asJson.summary;
      if (typeof asJson.html === "string") html = stripCodeFences(asJson.html);
      ready = Boolean(asJson.ready || html.length > 150);
    } catch {
      // Plain conversational text response
      if (!metaMatch && rawText.trim().length > 0 && html.length === 0) {
        reply = rawText.replace(/<<<[^>]+>>>/g, "").trim();
      }
    }
  }

  if (html.length > 150 && (html.toLowerCase().includes("<html") || html.toLowerCase().includes("<!doctype"))) {
    ready = true;
  } else {
    ready = false;
    html = "";
  }

  return { reply, ready, title, sector, summary, html };
}

async function resolveWithTimeout<T>(promise: Promise<T>, ms = 2500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_resolve, reject) =>
      setTimeout(() => reject(new Error("DNS timeout")), ms),
    ),
  ]);
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "4mb" }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  // Live published site preview route
  app.get("/site/:id", (req, res) => {
    const projects = ensureStore();
    const project = projects.find((item) => item.id === req.params.id);
    if (!project || !project.html_code) {
      res.status(404).send("<h1>Site bulunamadı</h1>");
      return;
    }
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(project.html_code);
  });

  // List projects
  app.get("/api/projects", (_req, res) => {
    const projects = ensureStore().sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );
    res.json({ projects });
  });

  // Get single project
  app.get("/api/projects/:id", (req, res) => {
    const projects = ensureStore();
    const project = projects.find((item) => item.id === req.params.id);
    if (!project) {
      res.status(404).json({ error: "Proje bulunamadı." });
      return;
    }
    res.json({ project });
  });

  // Create project
  app.post("/api/projects", (req, res) => {
    const body = req.body ?? {};
    const now = new Date().toISOString();
    const record: SiteProjectRecord = {
      id: `proj_${crypto.randomBytes(6).toString("hex")}`,
      title: String(body.title || "Yeni site"),
      sector: String(body.sector || ""),
      summary: String(body.summary || ""),
      html_code: String(body.html_code || ""),
      brief: String(body.brief || ""),
      package: String(body.package || "kurumsal"),
      messages: Array.isArray(body.messages) ? body.messages : [],
      domains: Array.isArray(body.domains) ? body.domains : [],
      purchased: Boolean(body.purchased),
      purchased_at: body.purchased ? now : null,
      created_at: now,
      updated_at: now,
    };
    const projects = ensureStore();
    projects.unshift(record);
    saveStore(projects);
    res.status(201).json({ project: record });
  });

  // Update project
  app.patch("/api/projects/:id", (req, res) => {
    const projects = ensureStore();
    const index = projects.findIndex((item) => item.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: "Proje bulunamadı." });
      return;
    }
    const existing = projects[index];
    const body = req.body ?? {};
    const now = new Date().toISOString();
    const updated: SiteProjectRecord = {
      ...existing,
      title: body.title !== undefined ? String(body.title) : existing.title,
      sector: body.sector !== undefined ? String(body.sector) : existing.sector,
      summary: body.summary !== undefined ? String(body.summary) : existing.summary,
      html_code: body.html_code !== undefined ? String(body.html_code) : existing.html_code,
      brief: body.brief !== undefined ? String(body.brief) : existing.brief,
      package: body.package !== undefined ? String(body.package) : existing.package,
      messages: Array.isArray(body.messages) ? body.messages : existing.messages,
      domains: Array.isArray(body.domains) ? body.domains : existing.domains,
      purchased: body.purchased !== undefined ? Boolean(body.purchased) : existing.purchased,
      purchased_at:
        body.purchased === true && !existing.purchased_at ? now : existing.purchased_at,
      updated_at: now,
    };
    projects[index] = updated;
    saveStore(projects);
    res.json({ project: updated });
  });

  // Delete project
  app.delete("/api/projects/:id", (req, res) => {
    const projects = ensureStore();
    const filtered = projects.filter((item) => item.id !== req.params.id);
    if (filtered.length === projects.length) {
      res.status(404).json({ error: "Proje bulunamadı." });
      return;
    }
    saveStore(filtered);
    res.json({ ok: true });
  });

  // Add custom domain to project
  app.post("/api/projects/:id/domains", (req, res) => {
    const projects = ensureStore();
    const index = projects.findIndex((item) => item.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: "Proje bulunamadı." });
      return;
    }

    const normalized = normalizeDomainInput(req.body?.domain);
    if (!normalized) {
      res.status(400).json({
        error: "Geçerli bir alan adı girin (ör. firmam.com veya www.firmam.com).",
      });
      return;
    }

    const existing = projects[index];
    if (existing.domains.some((d) => d.domain === normalized)) {
      res.status(409).json({ error: "Bu alan adı projeye zaten eklenmiş." });
      return;
    }

    const now = new Date().toISOString();
    const newDomain: CustomDomainRecord = {
      domain: normalized,
      status: "pending",
      verification_token: `codeai-verify=${crypto.randomBytes(5).toString("hex")}`,
      ssl_enabled: true,
      added_at: now,
      verified_at: null,
      last_checked_at: null,
      last_check_note: null,
    };

    const updated: SiteProjectRecord = {
      ...existing,
      domains: [newDomain, ...existing.domains],
      updated_at: now,
    };
    projects[index] = updated;
    saveStore(projects);
    res.status(201).json({ project: updated, domain: newDomain });
  });

  // Verify DNS records for a custom domain
  app.post("/api/projects/:id/domains/verify", async (req, res) => {
    const projects = ensureStore();
    const index = projects.findIndex((item) => item.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: "Proje bulunamadı." });
      return;
    }

    const normalized = normalizeDomainInput(req.body?.domain);
    if (!normalized) {
      res.status(400).json({ error: "Geçerli bir alan adı belirtin." });
      return;
    }

    const existing = projects[index];
    const domainIdx = existing.domains.findIndex((d) => d.domain === normalized);
    if (domainIdx === -1) {
      res.status(404).json({ error: "Alan adı bu projede bulunamadı." });
      return;
    }

    const targetDomain = existing.domains[domainIdx];
    const foundA = await resolveWithTimeout(dns.resolve4(normalized)).catch(() => [] as string[]);
    const foundCname = await resolveWithTimeout(dns.resolveCname(normalized)).catch(
      () => [] as string[],
    );
    const txtArrays = await resolveWithTimeout(
      dns.resolveTxt(`_codeai-verify.${normalized}`),
    ).catch(() => [] as string[][]);
    const foundTxt = txtArrays.flat();

    const matchesA = foundA.includes(TARGET_A_IP);
    const matchesCname = foundCname.some(
      (c) => c.toLowerCase().replace(/\.$/, "") === TARGET_CNAME,
    );
    const matchesTxt = foundTxt.includes(targetDomain.verification_token);
    const verified = matchesA || matchesCname || matchesTxt;

    const now = new Date().toISOString();
    let message = "";
    if (verified) {
      message = "DNS kayıtları doğrulandı. Alan adınız ve SSL sertifikası aktif.";
    } else {
      const detectedParts: string[] = [];
      if (foundA.length > 0) detectedParts.push(`A: ${foundA.join(", ")}`);
      if (foundCname.length > 0) detectedParts.push(`CNAME: ${foundCname.join(", ")}`);
      const detectedNote =
        detectedParts.length > 0
          ? `Şu an görünen kayıtlar (${detectedParts.join(" | ")}). `
          : "Henüz eşleşen bir A, CNAME veya TXT kaydı görülmedi. ";
      message = `${detectedNote}A kaydını ${TARGET_A_IP} veya CNAME kaydını ${TARGET_CNAME} olarak yönlendirin.`;
    }

    const updatedDomain: CustomDomainRecord = {
      ...targetDomain,
      status: verified ? "verified" : "pending",
      verified_at: verified ? targetDomain.verified_at || now : null,
      last_checked_at: now,
      last_check_note: message,
    };

    const nextDomains = [...existing.domains];
    nextDomains[domainIdx] = updatedDomain;

    const updatedProject: SiteProjectRecord = {
      ...existing,
      domains: nextDomains,
      updated_at: now,
    };
    projects[index] = updatedProject;
    saveStore(projects);

    res.json({
      project: updatedProject,
      verified,
      message,
      foundA,
      foundCname,
      foundTxt,
    });
  });

  // Remove custom domain from project
  app.delete("/api/projects/:id/domains/:domain", (req, res) => {
    const projects = ensureStore();
    const index = projects.findIndex((item) => item.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: "Proje bulunamadı." });
      return;
    }

    const target = decodeURIComponent(req.params.domain).toLowerCase();
    const existing = projects[index];
    const nextDomains = existing.domains.filter((d) => d.domain !== target);
    const updatedProject: SiteProjectRecord = {
      ...existing,
      domains: nextDomains,
      updated_at: new Date().toISOString(),
    };
    projects[index] = updatedProject;
    saveStore(projects);
    res.json({ project: updatedProject });
  });

  // AI Website Builder endpoint (fast ThinkingLevel.LOW + delimiter parsing)
  app.post("/api/builder", async (req, res) => {
    try {
      const { messages, currentHtml, packageTier } = req.body ?? {};
      if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: "Sohbet geçmişi gerekli." });
        return;
      }

      const ai = getAiClient();
      const recentMessages = messages.slice(-12);
      const conversationText = recentMessages
        .map((m: ChatMessage) => `${m.role === "user" ? "Kullanıcı" : "CODE AI"}: ${m.content}`)
        .join("\n\n");

      const promptParts: string[] = [
        `Seçili Paket: ${packageTier || "kurumsal"}`,
        `Sohbet Geçmişi:\n${conversationText}`,
      ];

      if (typeof currentHtml === "string" && currentHtml.trim().length > 0) {
        promptParts.push(
          `Mevcut HTML Kodu (kullanıcı değişiklik isterse bunu güncelle):\n${currentHtml}`,
        );
      }

      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: promptParts.join("\n\n---\n\n"),
        config: {
          systemInstruction: BUILDER_SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const rawText = (response.text ?? "").trim();
      if (!rawText) {
        res.status(502).json({ error: "Yapay zeka boş yanıt döndürdü, lütfen tekrar deneyin." });
        return;
      }

      const parsed = parseBuilderOutput(rawText);
      res.json(parsed);
    } catch (error: unknown) {
      const rawMessage =
        error instanceof Error ? error.message : "Yapay zeka yanıtı alınırken bir hata oluştu.";
      console.error("Builder API error:", error);

      let friendly = rawMessage;
      if (rawMessage.includes("API_KEY_INVALID") || rawMessage.includes("PERMISSION_DENIED")) {
        friendly =
          "API anahtarı doğrulanamadı. Lütfen Settings > Secrets panelinden geçerli bir GEMINI_API_KEY tanımlayın.";
      } else if (rawMessage.includes("RESOURCE_EXHAUSTED") || rawMessage.includes("429")) {
        friendly = "İstek kotasına ulaşıldı. Birkaç saniye bekleyip tekrar deneyin.";
      }

      res.status(500).json({ error: friendly });
    }
  });

  // Vite dev middleware vs static production build
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), "dist");
    app.use(express.static(distDir));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distDir, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CODE AI server running at http://localhost:${PORT}`);
  });
}

startServer();
