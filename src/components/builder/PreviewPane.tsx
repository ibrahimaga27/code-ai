import { useState } from "react";
import {
  Check,
  Code2,
  Copy,
  Download,
  Eye,
  Loader2,
  Maximize2,
  Monitor,
  Smartphone,
  Tablet,
  X,
} from "lucide-react";

interface PreviewPaneProps {
  html: string;
  loading: boolean;
  projectId: string | null;
  title?: string;
}

type ViewTab = "preview" | "code";
type DeviceMode = "desktop" | "tablet" | "mobile";

const DEVICE_WIDTH: Record<DeviceMode, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

export default function PreviewPane({
  html,
  loading,
  title,
}: PreviewPaneProps) {
  const [tab, setTab] = useState<ViewTab>("preview");
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const hasHtml = html.trim().length > 0;

  const handleCopy = async () => {
    if (!hasHtml) return;
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback ignored if clipboard permission unavailable
    }
  };

  const handleDownload = () => {
    if (!hasHtml) return;
    const slug = (title || "code-ai-site")
      .toLowerCase()
      .replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ]+/gi, "-")
      .replace(/^-+|-+$/g, "");
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slug || "web-sitesi"}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {/* Preview toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/80 px-4 py-2.5">
          {/* Segmented control: Önizleme / Kaynak Kod */}
          <div className="inline-flex items-center gap-1 rounded-lg bg-slate-200/70 p-1">
            <button
              type="button"
              onClick={() => setTab("preview")}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                tab === "preview"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              Önizleme
            </button>
            <button
              type="button"
              onClick={() => setTab("code")}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                tab === "code"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              HTML Kodu
            </button>
          </div>

          {/* Device switcher & export utilities */}
          <div className="flex items-center gap-2">
            {tab === "preview" && (
              <div className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5">
                <button
                  type="button"
                  onClick={() => setDevice("desktop")}
                  aria-label="Masaüstü görünüm"
                  className={`rounded-md p-1.5 transition-colors cursor-pointer ${
                    device === "desktop"
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Monitor className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDevice("tablet")}
                  aria-label="Tablet görünüm"
                  className={`rounded-md p-1.5 transition-colors cursor-pointer ${
                    device === "tablet"
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Tablet className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDevice("mobile")}
                  aria-label="Mobil görünüm"
                  className={`rounded-md p-1.5 transition-colors cursor-pointer ${
                    device === "mobile"
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleCopy}
              disabled={!hasHtml}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 whitespace-nowrap shrink-0 transition-colors hover:bg-slate-50 disabled:opacity-45 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  Kopyalandı
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Kopyala
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={!hasHtml}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 whitespace-nowrap shrink-0 transition-colors hover:bg-slate-50 disabled:opacity-45 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              İndir
            </button>

            <button
              type="button"
              onClick={() => setFullscreen(true)}
              disabled={!hasHtml}
              aria-label="Tam ekran önizleme"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-45 cursor-pointer"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Viewport content */}
        <div className="relative flex-1 overflow-auto bg-slate-100/80">
          {!hasHtml ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center px-6 py-12 text-center">
              {loading ? (
                <div className="space-y-3">
                  <Loader2 className="mx-auto h-7 w-7 animate-spin text-blue-600" />
                  <p className="font-display text-base font-semibold text-slate-900">
                    İlk önizleme hazırlanıyor
                  </p>
                  <p className="max-w-sm text-sm text-slate-500">
                    Sayfa düzeni, tipografi ve duyarlı bölümler birkaç saniye içinde burada görünecek.
                  </p>
                </div>
              ) : (
                <div className="max-w-md space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600">
                    <Monitor className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-slate-900">
                    Canlı site önizlemesi burada açılır
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500">
                    Sol panelden işinizi, hedef kitlenizi ve görmek istediğiniz bölümleri tek cümleyle yazın. Her yanıtınızla site anında güncellenir.
                  </p>
                </div>
              )}
            </div>
          ) : tab === "code" ? (
            <pre className="h-full overflow-auto bg-slate-950 p-5 font-mono text-xs leading-relaxed text-slate-200">
              <code>{html}</code>
            </pre>
          ) : (
            <div className="flex h-full w-full justify-center p-0 sm:p-3">
              <div
                style={{ width: DEVICE_WIDTH[device], maxWidth: "100%" }}
                className="h-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs transition-[width] duration-200"
              >
                <iframe
                  title={title || "Canlı Web Sitesi Önizlemesi"}
                  srcDoc={html}
                  sandbox="allow-scripts allow-forms allow-modals"
                  className="h-full w-full border-0 bg-white"
                />
              </div>
            </div>
          )}

          {loading && hasHtml && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
              <div className="inline-flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span>Site güncelleniyor...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Preview Overlay */}
      {fullscreen && hasHtml && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/90 p-3 sm:p-6">
          <div className="mb-3 flex items-center justify-between text-white">
            <span className="font-display text-sm font-semibold truncate">
              {title || "Tam Ekran Önizleme"}
            </span>
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 cursor-pointer"
            >
              <X className="h-4 w-4" />
              Kapat
            </button>
          </div>
          <div className="flex-1 overflow-hidden rounded-xl bg-white">
            <iframe
              title={title || "Tam Ekran Önizleme"}
              srcDoc={html}
              sandbox="allow-scripts allow-forms allow-modals"
              className="h-full w-full border-0"
            />
          </div>
        </div>
      )}
    </>
  );
}
