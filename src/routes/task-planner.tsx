import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Plus, Sparkles, Trash2 } from "lucide-react";
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
import { useAi } from "@/lib/use-ai";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner – EasyPace AI" },
      {
        name: "description",
        content:
          "Enter your workplace tasks and deadlines and get a prioritised schedule with urgency, task order and estimated time blocks.",
      },
      { property: "og:title", content: "AI Task Planner – EasyPace AI" },
      {
        property: "og:description",
        content: "Prioritise your workload and get a realistic daily or weekly schedule.",
      },
    ],
  }),
  component: TaskPlannerPage,
});

const SYSTEM = `You are EasyPace AI, a workplace task planning assistant.
Given a list of tasks with deadlines, respond with these exact markdown headings:
## Priority Order
## Urgent Tasks
## Suggested Schedule
## Estimated Time Blocks
## Planning Notes
Under Suggested Schedule, lay out realistic blocks (e.g. "09:00–10:30 — Task"). Be specific, concise and realistic about workload. Never invent tasks the user did not give you.`;

type Task = { id: number; name: string; deadline: string; effort: string };

let nextId = 3;

function TaskPlannerPage() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: "", deadline: "", effort: "Medium" },
    { id: 2, name: "", deadline: "", effort: "Medium" },
  ]);
  const [horizon, setHorizon] = useState("Daily");
  const [output, setOutput] = useState("");
  const { generate, loading } = useAi();

  const update = (id: number, patch: Partial<Task>) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const run = async () => {
    const filled = tasks.filter((t) => t.name.trim());
    if (filled.length === 0) {
      toast.error("Add at least one task first.");
      return;
    }
    const list = filled
      .map(
        (t, i) =>
          `${i + 1}. ${t.name} — deadline: ${t.deadline || "not specified"}, effort: ${t.effort}`,
      )
      .join("\n");
    const text = await generate(SYSTEM, [
      {
        role: "user",
        content: `Plan a ${horizon.toLowerCase()} schedule for these workplace tasks:\n${list}`,
      },
    ]);
    if (text) {
      setOutput(text);
      toast.success("Schedule ready");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        icon={<CalendarClock className="h-5 w-5" />}
        title="AI Task Planner"
        description="List what's on your plate. EasyPace AI prioritises it, flags what's urgent and builds a workable schedule."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your tasks</CardTitle>
            <CardDescription>Add tasks with deadlines and rough effort.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.map((task, index) => (
              <div key={task.id} className="rounded-lg border border-border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Task {index + 1}
                  </span>
                  {tasks.length > 1 ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove task ${index + 1}`}
                      onClick={() => setTasks((prev) => prev.filter((t) => t.id !== task.id))}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Task description"
                    aria-label={`Task ${index + 1} description`}
                    value={task.name}
                    onChange={(e) => update(task.id, { name: e.target.value })}
                  />
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Input
                      type="date"
                      aria-label={`Task ${index + 1} deadline`}
                      value={task.deadline}
                      onChange={(e) => update(task.id, { deadline: e.target.value })}
                    />
                    <Select
                      value={task.effort}
                      onValueChange={(v) => update(task.id, { effort: v })}
                    >
                      <SelectTrigger aria-label={`Task ${index + 1} effort`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["Low", "Medium", "High"].map((e) => (
                          <SelectItem key={e} value={e}>
                            {e} effort
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                setTasks((prev) => [
                  ...prev,
                  { id: nextId++, name: "", deadline: "", effort: "Medium" },
                ])
              }
            >
              <Plus className="h-4 w-4" />
              Add task
            </Button>

            <div className="space-y-2">
              <Label htmlFor="horizon">Planning horizon</Label>
              <Select value={horizon} onValueChange={setHorizon}>
                <SelectTrigger id="horizon">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily schedule</SelectItem>
                  <SelectItem value="Weekly">Weekly schedule</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={run} disabled={loading} className="w-full">
              <Sparkles className="h-4 w-4" />
              {loading ? "Planning…" : "Plan my schedule"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your schedule</CardTitle>
            <CardDescription>Priorities, urgency, order and time blocks.</CardDescription>
          </CardHeader>
          <CardContent>
            <AiOutput
              value={output}
              onChange={setOutput}
              loading={loading}
              onRegenerate={run}
              emptyTitle="No schedule yet"
              emptyHint="Add your tasks and select Plan my schedule."
            />
          </CardContent>
        </Card>
      </div>

      <ResponsibleAi compact />
    </div>
  );
}
