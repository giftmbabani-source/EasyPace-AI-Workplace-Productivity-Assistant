import { createFileRoute } from "@tanstack/react-router";
import { Bot, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { PageHeader } from "@/components/page-header";
import { ResponsibleAi } from "@/components/responsible-ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { AiMessage } from "@/lib/ai.functions";
import { useAi } from "@/lib/use-ai";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Workplace Assistant – EasyPace AI" },
      {
        name: "description",
        content:
          "Chat with EasyPace AI about organising tasks, drafting responses, summarising information and planning your workday.",
      },
      { property: "og:title", content: "AI Workplace Assistant – EasyPace AI" },
      {
        property: "og:description",
        content: "An interactive chat assistant for everyday workplace productivity questions.",
      },
    ],
  }),
  component: AssistantPage,
});

const SYSTEM =
  "You are EasyPace AI, a friendly and practical workplace productivity assistant. Give concise, actionable answers using short paragraphs and bullet points. Ask a clarifying question when the request is ambiguous. Remind users to verify important output when the stakes are high. Never request or store confidential information.";

const SUGGESTIONS = [
  "Help me organise my tasks.",
  "Draft a professional response.",
  "Summarise this information.",
  "Help me plan my workday.",
  "Help me prioritise my workload.",
];

function AssistantPage() {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState("");
  const { generate, loading } = useAi();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    const next: AiMessage[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    const reply = await generate(SYSTEM, next);
    if (reply) {
      setMessages([...next, { role: "assistant", content: reply }]);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        icon={<Bot className="h-5 w-5" />}
        title="AI Workplace Assistant"
        description="Ask anything about organising, drafting, summarising or planning your work."
      />

      <Card className="overflow-hidden">
        <CardContent className="flex h-[60vh] min-h-[420px] flex-col gap-4 p-0">
          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Bot className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    How can I help you work smarter today?
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Pick a starting point or type your own question.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.role === "user" ? "flex justify-end gap-3" : "flex justify-start gap-3"
                  }
                >
                  {m.role === "assistant" ? (
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Bot className="h-4 w-4" />
                    </span>
                  ) : null}
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                        : "max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5 text-sm text-foreground"
                    }
                  >
                    {m.content}
                  </div>
                  {m.role === "user" ? (
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <User className="h-4 w-4" />
                    </span>
                  ) : null}
                </div>
              ))
            )}

            {loading ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:120ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:240ms]" />
                EasyPace AI is typing…
              </div>
            ) : null}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="flex items-end gap-2 border-t border-border bg-card p-3 sm:p-4"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              rows={1}
              placeholder="Ask a workplace productivity question…"
              aria-label="Message"
              className="max-h-32 min-h-11 resize-none"
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()} aria-label="Send">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      <ResponsibleAi />
    </div>
  );
}
