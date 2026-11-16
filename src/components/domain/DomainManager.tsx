import React, { useState } from "react";
import {
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Globe,
  Loader2,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/Button";
import { SiteProjectApi } from "../../api/projectsClient";
import type { CustomDomain, SiteProject } from "../../types/project";

interface DomainManagerProps {
  project: SiteProject;
  onProjectUpdated: (updated: SiteProject) => void;
}

export default function DomainManager({
  project,
  onProjectUpdated,
}: DomainManagerProps) {
  const [domainInput, setDomainInput] = useState("");
  const [adding, setAdding] = useState(false);
  const [verifyingDomain, setVerifyingDomain] = useState<string | null>(null);
  const [removingDomain, setRemovingDomain] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const liveSitePath = `/site/${project.id}`;
  const fullLiveUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${liveSitePath}`
      : liveSitePath;

  const copyValue = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      // Ignore if clipboard unavailable
    }
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = domainInput.trim();
    if (!trimmed) return;

    setAdding(true);
    setError(null);
    setFeedback(null);
    try {
      const updated = await SiteProjectApi.addDomain(project.id, trimmed);
      onProjectUpdated(updated);
      setDomainInput("");
      setFeedback(
        "Alan adı eklendi. Aşağıdaki DNS kayıtlarını alan adı sağlayıcınıza girdikten sonra doğrulayın.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Alan adı eklenemedi.");
    } finally {
      setAdding(false);
    }
  };

  const handleVerify = async (domain: string) => {
    setVerifyingDomain(domain);
    setError(null);
    setFeedback(null);
    try {
      const result = await SiteProjectApi.verifyDomain(project.id, domain);
      onProjectUpdated(result.project);
      setFeedback(result.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "DNS doğrulaması başarısız.");
    } finally {
      setVerifyingDomain(null);
    }
  };

  const handleRemove = async (domain: string) => {
    setRemovingDomain(domain);
    setError(null);
    setFeedback(null);
    try {
      const updated = await SiteProjectApi.removeDomain(project.id, domain);
      onProjectUpdated(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Alan adı kaldırılamadı.");
    } finally {
      setRemovingDomain(null);
    }
  };

  const domains: CustomDomain[] = project.domains || [];

  return (
    <div className="space-y-5">
      {/* Live Hosted Preview URL */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-slate-500">Hazır Yayın Bağlantısı</p>
            <p className="mt-0.5 font-mono text-xs text-slate-800 break-all">
              {fullLiveUrl}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => copyValue("live-url", fullLiveUrl)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              {copiedKey === "live-url" ? (
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
            <a
              href={liveSitePath}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Siteyi Aç
            </a>
          </div>
        </div>
      </div>

      {/* Add Custom Domain Form */}
      <form onSubmit={handleAddDomain} className="space-y-2">
        <label className="block text-xs font-medium text-slate-700">
          Özel Alan Adı Bağla
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="ornekfirma.com veya www.ornekfirma.com"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
            />
          </div>
          <Button type="submit" variant="primary" size="md" disabled={adding}>
            {adding ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Ekleniyor...
              </>
            ) : (
              "Alan Adı Ekle"
            )}
          </Button>
        </div>
      </form>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
          {error}
        </div>
      )}

      {feedback && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs leading-relaxed text-slate-700">
          {feedback}
        </div>
      )}

      {/* Connected Domains List */}
      {domains.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center">
          <p className="text-sm font-medium text-slate-700">
            Henüz özel alan adı eklenmedi
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Kendi alan adınızı (ör. markam.com) ekleyip DNS yönlendirme kayıtlarını alabilirsiniz.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {domains.map((item) => {
            const isSubdomain = item.domain.split(".").length > 2;
            const hostLabel = isSubdomain ? item.domain.split(".")[0] : "@";

            return (
              <div
                key={item.domain}
                className="rounded-xl border border-slate-200 bg-white p-4 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-mono text-sm font-semibold text-slate-900">
                      {item.domain}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 text-xs">
                      {item.status === "verified" ? (
                        <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          DNS Doğrulandı · SSL Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-medium text-amber-700">
                          <Clock className="h-3.5 w-3.5" />
                          DNS Doğrulaması Bekleniyor
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={verifyingDomain === item.domain}
                      onClick={() => handleVerify(item.domain)}
                    >
                      {verifyingDomain === item.domain ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3.5 w-3.5" />
                      )}
                      DNS Kontrol Et
                    </Button>
                    <button
                      type="button"
                      disabled={removingDomain === item.domain}
                      onClick={() => handleRemove(item.domain)}
                      aria-label={`${item.domain} alan adını kaldır`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* DNS Record Table */}
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-3 py-2 font-medium">Tür</th>
                        <th className="px-3 py-2 font-medium">Ad / Host</th>
                        <th className="px-3 py-2 font-medium">Değer</th>
                        <th className="px-3 py-2 text-right font-medium">Kopyala</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-slate-800">
                      {!isSubdomain ? (
                        <tr>
                          <td className="px-3 py-2 font-semibold">A</td>
                          <td className="px-3 py-2">@</td>
                          <td className="px-3 py-2 tabular-nums">76.76.21.21</td>
                          <td className="px-3 py-2 text-right">
                            <button
                              type="button"
                              onClick={() => copyValue(`${item.domain}-a`, "76.76.21.21")}
                              className="text-blue-600 hover:underline cursor-pointer font-sans"
                            >
                              {copiedKey === `${item.domain}-a` ? "Kopyalandı" : "Kopyala"}
                            </button>
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td className="px-3 py-2 font-semibold">CNAME</td>
                          <td className="px-3 py-2">{hostLabel}</td>
                          <td className="px-3 py-2">cname.codeai.site</td>
                          <td className="px-3 py-2 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                copyValue(`${item.domain}-cname`, "cname.codeai.site")
                              }
                              className="text-blue-600 hover:underline cursor-pointer font-sans"
                            >
                              {copiedKey === `${item.domain}-cname`
                                ? "Kopyalandı"
                                : "Kopyala"}
                            </button>
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td className="px-3 py-2 font-semibold">TXT</td>
                        <td className="px-3 py-2">_codeai-verify</td>
                        <td className="px-3 py-2 break-all">{item.verification_token}</td>
                        <td className="px-3 py-2 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              copyValue(`${item.domain}-txt`, item.verification_token)
                            }
                            className="text-blue-600 hover:underline cursor-pointer font-sans"
                          >
                            {copiedKey === `${item.domain}-txt` ? "Kopyalandı" : "Kopyala"}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {item.last_check_note && (
                  <p className="text-xs leading-relaxed text-slate-600">
                    {item.last_check_note}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
