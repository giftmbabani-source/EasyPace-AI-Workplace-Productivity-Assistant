import { createFileRoute } from "@tanstack/react-router";
import { NotebookPen, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AiOutput } from "@/components/ai-output";
import { PageHeader } from "@/components/page-header";
import { ResponsibleAi } from "@/components/responsible-ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAi } from "@/lib/use-ai";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer – EasyPace AI" },
      {
        name: "description",
        content:
          "Paste raw meeting notes and get a structured summary with key decisions, action items, responsible persons and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer – EasyPace AI" },
      {
        property: "og:description",
        content: "Turn messy meeting notes into decisions, actions and deadlines.",
      },
    ],
  }),
  component: MeetingNotesPage,
});

const SYSTEM = `You are EasyPace AI, a meeting notes summarizer for workplace teams.
Always structure your answer with these exact markdown headings, in this order:
## Meeting Summary
## Key Decisions
## Action Items
## Responsible Persons
## Deadlines
Use concise bullet points. If information for a section is not present in the notes, write "Not specified in the notes." Never invent names, dates or decisions.`;

function MeetingNotesPage() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const { generate, loading } = useAi();

  const run = async () => {
    if (notes.trim().length < 20) {
      toast.error("Please paste your meeting notes first.");
      return;
    }
    const text = await generate(SYSTEM, [
      { role: "user", content: `Summarize these meeting notes:\n\n${notes}` },
    ]);
    if (text) {
      setOutput(text);
      toast.success("Notes summarised");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        icon={<NotebookPen className="h-5 w-5" />}
        title="Meeting Notes Summarizer"
        description="Paste long meeting notes and get a clear, structured record your team can act on."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Meeting notes</CardTitle>
            <CardDescription>Paste the raw notes exactly as you captured them.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Your notes</Label>
              <Textarea
                id="notes"
                rows={16}
                className="min-h-64"
                placeholder="Paste your meeting notes, transcript or bullet points here…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">{notes.length} characters</p>
            </div>
            <Button onClick={run} disabled={loading} className="w-full">
              <Sparkles className="h-4 w-4" />
              {loading ? "Summarizing…" : "Summarize"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Structured summary</CardTitle>
            <CardDescription>
              Summary, decisions, action items, owners and deadlines.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AiOutput
              value={output}
              onChange={setOutput}
              loading={loading}
              onRegenerate={run}
              emptyTitle="No summary yet"
              emptyHint="Paste your notes and select Summarize."
            />
          </CardContent>
        </Card>
      </div>

      <ResponsibleAi compact />
    </div>
  );
}
