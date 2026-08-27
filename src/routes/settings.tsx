import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings – EasyPace AI" },
      {
        name: "description",
        content:
          "Manage your EasyPace AI profile, default tone, working hours and responsible AI preferences.",
      },
      { property: "og:title", content: "Settings – EasyPace AI" },
      {
        property: "og:description",
        content: "Personalise how EasyPace AI writes, plans and assists you at work.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [tone, setTone] = useState("Professional");
  const [hours, setHours] = useState("09:00–17:00");
  const [tips, setTips] = useState(true);
  const [confirmSensitive, setConfirmSensitive] = useState(true);

  return (
    <div className="space-y-8">
      <PageHeader
        icon={<SettingsIcon className="h-5 w-5" />}
        title="Settings"
        description="Personalise how EasyPace AI writes, plans and assists you throughout the workday."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription>Used to personalise drafts and schedules.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Display name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Job title</Label>
            <Input
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Project Coordinator"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Work preferences</CardTitle>
          <CardDescription>Defaults applied across EasyPace AI tools.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="deftone">Default email tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="deftone">
                  <SelectValue />
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
            <div className="space-y-2">
              <Label htmlFor="hours">Working hours</Label>
              <Input id="hours" value={hours} onChange={(e) => setHours(e.target.value)} />
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Show productivity tips</p>
              <p className="text-xs text-muted-foreground">Display AI tips on your dashboard.</p>
            </div>
            <Switch checked={tips} onCheckedChange={setTips} aria-label="Show productivity tips" />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Sensitive information reminder</p>
              <p className="text-xs text-muted-foreground">
                Remind me not to paste confidential details into AI tools.
              </p>
            </div>
            <Switch
              checked={confirmSensitive}
              onCheckedChange={setConfirmSensitive}
              aria-label="Sensitive information reminder"
            />
          </div>

          <Button onClick={() => toast.success("Preferences saved for this session")}>
            Save preferences
          </Button>
        </CardContent>
      </Card>

      <ResponsibleAi />
    </div>
  );
}
