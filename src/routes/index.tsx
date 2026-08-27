import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  CalendarClock,
  CheckCircle2,
  Clock,
  Lightbulb,
  Mail,
  NotebookPen,
  Search,
  TrendingUp,
} from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { ResponsibleAi } from "@/components/responsible-ai";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard – EasyPace AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Your EasyPace AI dashboard: productivity overview, quick actions for every AI tool, recent activity and workplace AI tips.",
      },
      { property: "og:title", content: "Dashboard – EasyPace AI" },
      {
        property: "og:description",
        content: "Productivity overview and quick access to every EasyPace AI workplace tool.",
      },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    desc: "Draft clear, well-toned workplace emails in seconds.",
  },
  {
    to: "/meeting-notes",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    desc: "Turn raw notes into decisions, actions and deadlines.",
  },
  {
    to: "/task-planner",
    icon: CalendarClock,
    title: "AI Task Planner",
    desc: "Prioritise your workload and get a realistic schedule.",
  },
  {
    to: "/research",
    icon: Search,
    title: "AI Research Assistant",
    desc: "Summarise sources and surface key insights fast.",
  },
  {
    to: "/assistant",
    icon: Bot,
    title: "AI Workplace Assistant",
    desc: "Chat through any productivity question you have.",
  },
] as const;

const TIPS = [
  "Batch similar tasks together — context switching is the biggest silent time cost.",
  "Give the AI your constraints (audience, tone, deadline) — specific inputs make better outputs.",
  "Plan tomorrow at the end of today, while the context is still fresh.",
  "Protect one deep-work block per day and defend it like a meeting.",
];

function Dashboard() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome back"
        description="Work smarter. Move at your own pace. Select a tool below and let EasyPace AI handle the busywork."
      />

      <section aria-label="Productivity overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Focus score", value: "78%", icon: TrendingUp, hint: "+6% vs last week" },
          { label: "Tasks planned", value: "12", icon: CheckCircle2, hint: "4 marked urgent" },
          { label: "Hours saved", value: "5.4", icon: Clock, hint: "Estimated this week" },
          { label: "AI drafts", value: "9", icon: Mail, hint: "Emails & summaries" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center justify-between gap-4 pt-6">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{stat.hint}</p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <stat.icon className="h-5 w-5" />
              </span>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Weekly workload</CardTitle>
          <CardDescription>An illustrative view of how your week is tracking.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Deep work", value: 64 },
            { label: "Meetings", value: 42 },
            { label: "Admin & email", value: 25 },
          ].map((row) => (
            <div key={row.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{row.label}</span>
                <span>{row.value}%</span>
              </div>
              <Progress value={row.value} />
            </div>
          ))}
        </CardContent>
      </Card>

      <section aria-label="Quick actions" className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {FEATURES.map((f) => (
            <Link key={f.to} to={f.to} className="group">
              <Card className="h-full transition-all group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-md">
                <CardHeader>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <CardTitle className="mt-3 text-base">{f.title}</CardTitle>
                  <CardDescription>{f.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Open tool
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent activity</CardTitle>
            <CardDescription>Your latest EasyPace AI sessions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { icon: Mail, title: "Drafted a client follow-up email", time: "Today, 09:12" },
              { icon: NotebookPen, title: "Summarised Monday stand-up notes", time: "Yesterday, 16:40" },
              { icon: CalendarClock, title: "Built a weekly task schedule", time: "Yesterday, 08:05" },
              { icon: Search, title: "Researched market benchmarks", time: "Mon, 14:22" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <item.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="h-4 w-4 text-primary" />
              AI productivity tips
            </CardTitle>
            <CardDescription>Small habits that compound quickly.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {TIPS.map((tip) => (
                <li key={tip} className="flex gap-2.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <ResponsibleAi />
    </div>
  );
}
