import { ShieldCheck } from "lucide-react";

export function ResponsibleAi({ compact = false }: { compact?: boolean }) {
  return (
    <section
      aria-label="Responsible AI notice"
      className="rounded-lg border border-border bg-accent/40 p-4 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-foreground">Responsible AI</h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            AI-generated content may contain errors or inaccuracies. Users should review and verify
            all outputs before using them for important workplace decisions or communications. Do
            not enter confidential, sensitive, or private information into EasyPace AI.
          </p>
          {!compact ? (
            <p className="text-xs leading-relaxed text-muted-foreground">
              EasyPace AI is designed to support human productivity and decision-making, not replace
              professional judgement.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
