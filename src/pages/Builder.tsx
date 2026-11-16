import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Globe, RotateCcw, ShoppingBag, X } from "lucide-react";
import { Button, buttonClasses } from "../components/ui/Button";
import AppHeader from "../components/site/AppHeader";
import ChatPanel from "../components/builder/ChatPanel";
import PreviewPane from "../components/builder/PreviewPane";
import DomainManager from "../components/domain/DomainManager";
import { askBuilder } from "../lib/ai";
import { SiteProjectApi } from "../api/projectsClient";
import { getPackagePlan } from "../lib/packages";
import type { ChatMessage, SiteProject } from "../types/project";

const GREETING =
  "Merhaba, ben CODE AI. Nasıl bir site istediğini anlat: kim için, ne iş yapıyorsun ve hangi bölümler olsun? Tek cümleyle başlayabilirsin, eksikleri ben sorarım.";

export default function Builder() {
  const [params, setParams] = useSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [html, setHtml] = useState("");
  const [title, setTitle] = useState("");
  const [sector, setSector] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [project, setProject] = useState<SiteProject | null>(null);
  const [loading, setLoading] = useState(false);
  const [domainModalOpen, setDomainModalOpen] = useState(false);

  const packageTier = params.get("paket") || "kurumsal";
  const packagePlan = getPackagePlan(packageTier);
  const autoPromptSentRef = useRef<string | null>(null);
  const loadedProjectRef = useRef<string | null>(null);

  const send = useCallback(
    async (text: string, overrideMessages?: ChatMessage[], overrideHtml?: string) => {
      const baseMessages = overrideMessages ?? messages;
      const currentHtmlVal = overrideHtml ?? html;
      const next: ChatMessage[] = [...baseMessages, { role: "user", content: text }];
      setMessages(next);
      setLoading(true);
      try {
        const result = await askBuilder({
          messages: next,
          currentHtml: currentHtmlVal,
          packageTier,
        });

        const updatedMessages: ChatMessage[] = [
          ...next,
          { role: "assistant", content: result?.reply || "Devam edelim." },
        ];
        setMessages(updatedMessages);

        const code = typeof result?.html === "string" ? result.html.trim() : "";
        if (result?.ready && code.length > 150) {
          const siteTitle = result.title || "Yeni site";
          const siteSector = result.sector || "";
          const payload = {
            title: siteTitle,
            sector: siteSector,
            summary: result.summary || "",
            html_code: code,
            brief: next
              .filter((message) => message.role === "user")
              .map((message) => message.content)
              .join(" | "),
            package: packageTier,
            messages: updatedMessages,
          };
          setHtml(code);
          setTitle(siteTitle);
          setSector(siteSector);

          if (projectId) {
            const updatedRecord = await SiteProjectApi.update(projectId, payload);
            setProject(updatedRecord);
          } else {
            const record = await SiteProjectApi.create(payload);
            setProject(record);
            setProjectId(record.id);
            loadedProjectRef.current = record.id;
            const nextParams = new URLSearchParams(params);
            nextParams.set("proje", record.id);
            nextParams.delete("prompt");
            setParams(nextParams, { replace: true });
          }
        }
      } catch (error) {
        const errMsg =
          error instanceof Error && error.message
            ? `Bir sorun oluştu: ${error.message}`
            : "Bağlantıda bir sorun oldu. Mesajını tekrar gönderir misin?";
        setMessages((prev) => [...prev, { role: "assistant", content: errMsg }]);
      } finally {
        setLoading(false);
      }
    },
    [html, messages, packageTier, params, projectId, setParams],
  );

  // Load an existing project when ?proje=<id> is provided
  useEffect(() => {
    const projeParam = params.get("proje");
    if (!projeParam || loadedProjectRef.current === projeParam) return;
    loadedProjectRef.current = projeParam;

    SiteProjectApi.get(projeParam)
      .then((proj) => {
        setProject(proj);
        setProjectId(proj.id);
        setTitle(proj.title || "Yeni site");
        setSector(proj.sector || "");
        setHtml(proj.html_code || "");
        setMessages(
          proj.messages && proj.messages.length > 0
            ? proj.messages
            : [{ role: "assistant", content: GREETING }],
        );
      })
      .catch(() => {
        // Ignore if project cannot be loaded
      });
  }, [params]);

  // Auto-send initial prompt when navigated from Landing page (?prompt=...)
  useEffect(() => {
    const initialPrompt = params.get("prompt");
    const projeParam = params.get("proje");
    if (!initialPrompt || projeParam || autoPromptSentRef.current === initialPrompt) {
      return;
    }
    autoPromptSentRef.current = initialPrompt;
    send(initialPrompt, [{ role: "assistant", content: GREETING }], "");
  }, [params, send]);

  const reset = () => {
    setMessages([{ role: "assistant", content: GREETING }]);
    setHtml("");
    setTitle("");
    setSector("");
    setProject(null);
    setProjectId(null);
    loadedProjectRef.current = null;
    autoPromptSentRef.current = null;
    const nextParams = new URLSearchParams(params);
    nextParams.delete("proje");
    nextParams.delete("prompt");
    setParams(nextParams, { replace: true });
  };

  const primaryDomain = project?.domains?.[0]?.domain;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AppHeader />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-8 lg:h-[calc(100vh-4rem)] lg:flex-row lg:overflow-hidden">
        {/* Left: ChatPanel */}
        <div className="h-[52vh] overflow-hidden rounded-2xl border border-slate-200 bg-white sm:h-[50vh] lg:h-auto lg:w-[38%]">
          <ChatPanel messages={messages} onSend={(txt) => send(txt)} loading={loading} />
        </div>

        {/* Right: Project bar + Live Preview */}
        <div className="flex min-h-[52vh] flex-1 flex-col gap-4 lg:min-h-0">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Proje</span>
                <span aria-hidden="true">·</span>
                <span>{packagePlan.name} Paketi</span>
                {sector && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{sector}</span>
                  </>
                )}
                {primaryDomain && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-700 truncate">{primaryDomain}</span>
                  </>
                )}
              </div>
              <h1 className="truncate font-display text-lg font-semibold text-slate-900">
                {title || "Yeni site"}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="ghost" size="sm" onClick={reset}>
                <RotateCcw className="h-4 w-4" />
                Yeni sohbet
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!projectId}
                onClick={() => setDomainModalOpen(true)}
              >
                <Globe className="h-4 w-4" />
                {primaryDomain ? "Alan adı" : "Alan adı ekle"}
              </Button>
              {projectId ? (
                <Link
                  to={`/odeme?proje=${projectId}`}
                  className={buttonClasses({ variant: "primary", size: "sm" })}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Satın al ve kodu al
                </Link>
              ) : (
                <Button disabled size="sm">
                  <ShoppingBag className="h-4 w-4" />
                  Satın al ve kodu al
                </Button>
              )}
            </div>
          </div>

          <div className="min-h-[46vh] flex-1 lg:min-h-0">
            <PreviewPane
              html={html}
              loading={loading}
              projectId={projectId}
              title={title}
            />
          </div>
        </div>
      </div>

      {/* Custom Domain Modal */}
      {domainModalOpen && project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="font-display text-xl font-semibold text-slate-900">
                  Alan Adı & Yayın Ayarları
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {project.title} için hazır yayın bağlantısını kullanabilir veya kendi alan adınızı bağlayabilirsiniz.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDomainModalOpen(false)}
                aria-label="Kapat"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <DomainManager
              project={project}
              onProjectUpdated={(updated) => setProject(updated)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
