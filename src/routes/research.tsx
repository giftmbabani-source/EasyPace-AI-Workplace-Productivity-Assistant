import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AiOutput } from "@/components/ai-output";
import { PageHeader } from "@/components/page-header";
import { ResponsibleAi } from "@/components/responsible-ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAi } from "@/lib/use-ai";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant – EasyPace AI" },
      {
        name: "description",
        content:
          "Summarise articles and notes, surface key insights and recommendations, and get questions for further research.",
      },
      { property: "og:title", content: "AI Research Assistant – EasyPace AI" },
      {
        property: "og:description",
        content: "Summarise sources and surface key workplace insights fast.",
      },
    ],
  }),
  component: ResearchPage,
});

const SYSTEM = `You are EasyPace AI, a workplace research assistant.
Respond with these exact markdown headings:
## Concise Summary
## Key Insights
## Important Points
## Recommendations
## Questions for Further Research
Base everything on the material provided. Where you rely on general knowledge rather than the supplied text, say so explicitly. Never fabricate statistics, citations or sources.`;

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [article, setArticle] = useState("");
  const [notes, setNotes] = useState("");
  const [questions, setQuestions] = useState("");
  const [output, setOutput] = useState("");
  const { generate, loading } = useAi();

  const run = async () => {
    if (!topic.trim() && !article.trim()) {
      toast.error("Enter a research topic or paste some source text.");
      return;
    }
    const text = await generate(SYSTEM, [
      {
        role: "user",
        content: `Research topic: ${topic || "Not specified"}

Article text:
${article || "None provided"}

My notes:
${notes || "None provided"}

My questions:
${questions || "None provided"}`,
      },
    ]);
    if (text) {
      setOutput(text);
      toast.success("Research brief ready");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        icon={<Search className="h-5 w-5" />}
        title="AI Research Assistant"
        description="Bring your topic, source text, notes and questions — get a structured brief you can build on."
      />

      <div
        role="note"
        className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
      >
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          AI-generated information should always be verified using credible and authoritative
          sources before it is used in reports, decisions or published work.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Research input</CardTitle>
            <CardDescription>All fields are optional except a topic or source text.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Research topic</Label>
              <Input
                id="topic"
                placeholder="e.g. Hybrid work policies in mid-sized companies"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="article">Article text</Label>
              <Textarea
                id="article"
                rows={8}
                placeholder="Paste the article or source material here…"
                value={article}
                onChange={(e) => setArticle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rnotes">Notes</Label>
              <Textarea
                id="rnotes"
                rows={4}
                placeholder="Your own observations so far…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rquestions">Questions</Label>
              <Textarea
                id="rquestions"
                rows={3}
                placeholder="What do you want answered?"
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
              />
            </div>
            <Button onClick={run} disabled={loading} className="w-full">
              <Sparkles className="h-4 w-4" />
              {loading ? "Researching…" : "Generate research brief"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Research brief</CardTitle>
            <CardDescription>Summary, insights, recommendations and next questions.</CardDescription>
          </CardHeader>
          <CardContent>
            <AiOutput
              value={output}
              onChange={setOutput}
              loading={loading}
              onRegenerate={run}
              emptyTitle="No brief yet"
              emptyHint="Add a topic or paste source material to begin."
            />
          </CardContent>
        </Card>
      </div>

      <ResponsibleAi compact />
    </div>
  );
}
