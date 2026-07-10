import React from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Building2, Briefcase, GraduationCap, Kanban,
  BarChart3, Activity, Settings, Bell, Search, Sun, Moon, LogOut, ChevronsLeft, ChevronsRight, User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

const ADMIN_NAV = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/candidates", label: "Candidates", icon: Users },
  { to: "/app/pipeline", label: "Pipeline", icon: Kanban },
  { to: "/app/companies", label: "Companies", icon: Building2 },
  { to: "/app/jobs", label: "Job Openings", icon: Briefcase },
  { to: "/app/batches", label: "Batches", icon: GraduationCap },
  { to: "/app/employees", label: "Employees", icon: Users, adminOnly: true },
  { to: "/app/reports", label: "Reports", icon: BarChart3 },
  { to: "/app/activity", label: "Activity Log", icon: Activity },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

const CANDIDATE_NAV = [
  { to: "/me", label: "My Workspace", icon: User, end: true },
];

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [results, setResults] = React.useState(null);
  const [notifs, setNotifs] = React.useState({ items: [], unread: 0 });

  const NAV = user?.role === "candidate" ? CANDIDATE_NAV
    : ADMIN_NAV.filter(n => !n.adminOnly || user?.role === "admin");

  const fetchNotifs = React.useCallback(async () => {
    try {
      const r = await api.get("/notifications");
      setNotifs(r.data);
    } catch (e) {}
  }, []);
  React.useEffect(() => {
    fetchNotifs();
    const t = setInterval(fetchNotifs, 30000);
    return () => clearInterval(t);
  }, [fetchNotifs]);

  React.useEffect(() => {
    if (!q || q.length < 2) { setResults(null); return; }
    const t = setTimeout(async () => {
      try { const r = await api.get(`/search?q=${encodeURIComponent(q)}`); setResults(r.data); }
      catch { setResults(null); }
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  const initials = (user?.full_name || user?.email || "?").split(" ").map(x => x[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className={`${collapsed ? "w-[76px]" : "w-64"} shrink-0 hidden md:flex flex-col border-r border-border bg-white dark:bg-slate-900/40 transition-[width] duration-200`}>
        <div className="h-16 flex items-center gap-2.5 px-4 border-b border-border">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] grid place-items-center soft-shadow shrink-0">
            <span className="text-white font-display font-bold text-lg">U</span>
          </div>
          {!collapsed && (
            <div className="leading-none">
              <div className="font-display font-bold tracking-tight">UGS HireFlow</div>
              <div className="text-[10px] text-muted-foreground overline mt-0.5">Recruitment OS</div>
            </div>
          )}
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.end} data-testid={`sidebar-${n.label.toLowerCase().replace(/\s/g, "-")}`}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                }`}>
              <n.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{n.label}</span>}
            </NavLink>
          ))}
        </nav>
        <button onClick={() => setCollapsed(!collapsed)} className="m-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800/60" data-testid="sidebar-collapse">
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <><ChevronsLeft className="h-4 w-4" /> <span>Collapse</span></>}
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 glass border-b border-border/60 px-4 md:px-6 flex items-center gap-3">
          <Popover open={!!results && q.length >= 2} onOpenChange={(o) => !o && setResults(null)}>
            <PopoverTrigger asChild>
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search candidates, companies, jobs..."
                  className="pl-9 bg-white/60 dark:bg-slate-900/60 border-border/60"
                  data-testid="global-search-input" />
              </div>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[520px] p-0">
              {results && (
                <div className="max-h-96 overflow-y-auto p-2">
                  {["candidates", "companies", "jobs"].map(k => (results[k]?.length ? (
                    <div key={k} className="mb-2">
                      <div className="overline text-xs text-muted-foreground px-2 pt-2 pb-1">{k}</div>
                      {results[k].map(item => (
                        <button key={item.id} className="w-full text-left px-2 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-sm flex items-center justify-between"
                          onClick={() => {
                            setQ(""); setResults(null);
                            if (k === "candidates") navigate(`/app/candidates/${item.id}`);
                            if (k === "companies") navigate(`/app/companies`);
                            if (k === "jobs") navigate(`/app/jobs`);
                          }}>
                          <span>{item.full_name || item.name || item.title}</span>
                          <span className="text-xs text-muted-foreground">{item.candidate_code || item.industry || item.status}</span>
                        </button>
                      ))}
                    </div>
                  ) : null))}
                  {!results.candidates?.length && !results.companies?.length && !results.jobs?.length && (
                    <div className="p-4 text-sm text-muted-foreground text-center">No results</div>
                  )}
                </div>
              )}
            </PopoverContent>
          </Popover>

          <Button variant="ghost" size="icon" onClick={toggle} data-testid="theme-toggle">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" data-testid="notifications-btn">
                <Bell className="h-4 w-4" />
                {notifs.unread > 0 && <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] grid place-items-center">{notifs.unread}</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {notifs.unread > 0 && (
                  <button onClick={async () => { await api.post("/notifications/mark-all-read"); fetchNotifs(); }}
                    className="text-xs text-primary hover:underline">Mark all read</button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifs.items.length === 0 && <div className="p-4 text-sm text-muted-foreground text-center">No notifications</div>}
              <div className="max-h-80 overflow-y-auto">
                {notifs.items.slice(0, 12).map(n => (
                  <div key={n.id} className={`px-3 py-2 text-sm ${!n.is_read ? "bg-primary/5" : ""}`}>
                    <div className="font-medium">{n.title}</div>
                    <div className="text-xs text-muted-foreground">{n.message}</div>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2" data-testid="user-menu">
                <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback></Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="font-medium">{user?.full_name}</div>
                <div className="text-xs text-muted-foreground">{user?.email}</div>
                <Badge variant="secondary" className="mt-2 capitalize">{user?.role}</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} data-testid="logout-btn"><LogOut className="h-4 w-4 mr-2" /> Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 min-w-0 p-4 md:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
