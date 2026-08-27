import { Check, Copy, RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
  onRegenerate?: () => void;
  emptyTitle?: string;
  emptyHint?: string;
  rows?: number;
};

export function AiOutput({
  value,
  onChange,
  loading,
  onRegenerate,
  emptyTitle = "No output yet",
  emptyHint = "Fill in the form and let EasyPace AI do the work.",
  rows = 16,
}: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not copy. Please copy manually.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/40 p-8 text-center">
        <Sparkles className="h-6 w-6 animate-pulse text-primary" />
        <p className="text-sm font-medium text-foreground">EasyPace AI is working…</p>
        <p className="text-xs text-muted-foreground">This usually takes a few seconds.</p>
        <div className="mt-2 w-full max-w-sm space-y-2">
          <div className="h-2.5 animate-pulse rounded-full bg-muted" />
          <div className="h-2.5 w-5/6 animate-pulse rounded-full bg-muted" />
          <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    );
  }

  if (!value) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
        <Sparkles className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">{emptyTitle}</p>
        <p className="max-w-xs text-xs text-muted-foreground">{emptyHint}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-64 resize-y font-normal leading-relaxed"
        aria-label="AI generated output, editable"
      />
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={copy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </Button>
        {onRegenerate ? (
          <Button type="button" variant="outline" size="sm" onClick={onRegenerate}>
            <RefreshCw className="h-4 w-4" />
            Regenerate
          </Button>
        ) : null}
        <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
          Clear
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Output is editable — refine it before you use it.
      </p>
    </div>
  );
}
