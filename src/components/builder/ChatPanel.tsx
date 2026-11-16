import React, { useEffect, useRef, useState } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import type { ChatMessage } from "../../types/project";

interface ChatPanelProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  loading: boolean;
}

const STARTER_PROMPTS = [
  "İstanbul'da modern bir diş kliniği için randevu ve tedavi tanıtım sitesi yap",
  "Kadıköy'de özel kahve kavuran butik kafe için menü ve adres sitesi oluştur",
  "B2B lojistik yazılımı için ürün özellikleri ve fiyatlandırma sayfası tasarla",
  "Serbest ürün tasarımcısı için seçili işler ve iletişim portfolyosu hazırla",
];

export default function ChatPanel({ messages, onSend, loading }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setInput("");
    onSend(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const showStarters = messages.length <= 1 && !loading;

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Tasarım Sohbeti</h2>
          <p className="text-xs text-slate-500">
            İstediğin değişikliği doğal dille yaz, önizleme anında güncellensin.
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {messages.map((msg, idx) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={`${idx}-${msg.role}`}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <span className="mb-1 text-[11px] font-medium text-slate-400">
                {isUser ? "Siz" : "CODE AI"}
              </span>
              <div
                className={`max-w-[88%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-slate-50 text-slate-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}

        {showStarters && (
          <div className="pt-2">
            <p className="mb-2.5 text-xs font-medium text-slate-500">
              Hızlı başlangıç örnekleri
            </p>
            <div className="grid gap-2">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => onSend(prompt)}
                  className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-left text-xs leading-relaxed text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50/40 hover:text-slate-900 cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-start gap-2.5 pt-1">
            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-600">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
              <span>Site tasarlanıyor ve kod hazırlanıyor...</span>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-slate-200 bg-slate-50/60 p-3.5"
      >
        <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-white p-2 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/10">
          <textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder="Örn: Sağ üstte randevu butonu olsun, renkler lacivert ve krem tonlarında..."
            className="max-h-36 min-h-[44px] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Mesaj gönder"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
