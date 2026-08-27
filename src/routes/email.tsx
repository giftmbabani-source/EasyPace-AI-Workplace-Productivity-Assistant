import { createFileRoute } from "@tanstack/react-router";
import { Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AiOutput } from "@/components/ai-output";
import { PageHeader } from "@/components/page-header";
import { ResponsibleAi } from "@/components/responsible-ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAi } from "@/lib/use-ai";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator – EasyPace AI" },
      {
        name: "description",
        content:
          "Generate professional workplace emails with the tone you need — formal, professional, friendly or persuasive.",
      },
      { property: "og:title", content: "Smart Email Generator – EasyPace AI" },
      {
        property: "og:description",
        content: "Draft clear workplace emails in seconds with EasyPace AI.",
      },
    ],
  }),
  component: EmailPage,
});

const SYSTEM =
  "You are EasyPace AI, a workplace email writing assistant. Write complete, ready-to-send workplace emails. Always include a subject line, greeting, well-structured body and a professional sign-off. Keep it concise and free of filler. Never invent facts that were not provided.";

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [points, setPoints] = useState("");
  const [tone, setTone] = useState("Professional");
  const [output, setOutput] = useState("");
  const { generate, loading } = useAi();

  const run = async () => {
    if (!purpose.trim()) {
      toast.error("Please describe the purpose of the email.");
      return;
    }
    const prompt = `Write a workplace email.
Recipient: ${recipient || "Not specified"}
Purpose: ${purpose}
Important points to include:
${points || "None provided"}
Preferred tone: ${tone}`;
    const text = await generate(SYSTEM, [{ role: "user", content: prompt }]);
    if (text) {
      setOutput(text);
      toast.success("Email drafted");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        icon={<Mail className="h-5 w-5" />}
        title="Smart Email Generator"
        description="Give EasyPace AI the essentials and get a polished workplace email you can edit, copy and send."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Email details</CardTitle>
            <CardDescription>The more context you give, the better the draft.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                placeholder="e.g. Thandi, Operations Manager"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Email purpose</Label>
              <Input
                id="purpose"
                placeholder="e.g. Request a deadline extension for the Q3 report"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Important points</Label>
              <Textarea
                id="points"
                rows={6}
                placeholder={"One point per line, e.g.\n- Data arrived late from finance\n- New date proposed: 14 March"}
                value={points}
                onChange={(e) => setPoints(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Preferred tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone">
                  <SelectValue placeholder="Select a tone" />
                </SelectTrigger>
                <SelectContent>
                  {["Formal", "Professional", "Friendly", "Persuasive"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={run} disabled={loading} className="w-full">
              <Sparkles className="h-4 w-4" />
              {loading ? "Generating…" : "Generate Email"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Generated email</CardTitle>
            <CardDescription>Edit the draft directly before you copy it.</CardDescription>
          </CardHeader>
          <CardContent>
            <AiOutput
              value={output}
              onChange={setOutput}
              loading={loading}
              onRegenerate={run}
              emptyTitle="No email yet"
              emptyHint="Complete the form and select Generate Email."
            />
          </CardContent>
        </Card>
      </div>

      <ResponsibleAi compact />
    </div>
  );
}
