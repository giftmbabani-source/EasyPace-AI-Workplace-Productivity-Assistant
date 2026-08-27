import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bot,
  CalendarClock,
  LayoutDashboard,
  Mail,
  Menu,
  NotebookPen,
  Search,
  Settings,
  Zap,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Smart Email Generator", icon: Mail },
  { to: "/meeting-notes", label: "Meeting Notes Summarizer", icon: NotebookPen },
  { to: "/task-planner", label: "AI Task Planner", icon: CalendarClock },
  { to: "/research", label: "AI Research Assistant", icon: Search },
  { to: "/assistant", label: "AI Workplace Assistant", icon: Bot },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Zap className="h-5 w-5" />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold tracking-tight text-foreground">
          EasyPace AI
        </span>
        <span className="block text-[11px] text-muted-foreground">Work smarter.</span>
      </span>
    </Link>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="space-y-1" aria-label="Main navigation">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.to;
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="h-4.5 w-4.5 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card px-4 py-5 lg:flex">
        <Brand />
        <div className="mt-7 flex-1 overflow-y-auto">
          <NavList />
        </div>
        <div className="rounded-lg bg-accent/50 p-3 text-[11px] leading-relaxed text-muted-foreground">
          Always review AI output before sharing it at work.
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-card/90 px-4 backdrop-blur sm:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-4">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <Brand />
              <div className="mt-7">
                <NavList onNavigate={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden min-w-0 flex-1 sm:block">
            <p className="truncate text-sm font-medium text-foreground">
              Workplace Productivity Assistant
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Work smarter. Move at your own pace.
            </p>
          </div>
          <div className="flex flex-1 items-center justify-end gap-3 sm:flex-none">
            <span className="hidden rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground sm:inline">
              AI powered
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              EP
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
