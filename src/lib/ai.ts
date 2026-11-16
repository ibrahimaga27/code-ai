import type { BuilderResult, ChatMessage } from "../types/project";

export async function askBuilder(params: {
  messages: ChatMessage[];
  currentHtml: string;
  packageTier?: string;
}): Promise<BuilderResult> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 90000);

  try {
    const response = await fetch("/api/builder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.error || "Yapay zeka servisine bağlanılamadı.");
    }

    return data as BuilderResult;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Yanıt süresi aşıldı. Lütfen mesajını tekrar gönder.");
    }
    throw err;
  } finally {
    window.clearTimeout(timer);
  }
}
