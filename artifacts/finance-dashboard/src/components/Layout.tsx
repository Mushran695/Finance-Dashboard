import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  Moon,
  Sun,
  Menu,
  X,
  Shield,
  Eye,
  ChevronDown,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { path: "/insights", label: "Insights", icon: Lightbulb },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { role, setRole, theme, toggleTheme } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          data-testid="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full z-30 flex flex-col w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        data-testid="sidebar"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-sidebar-foreground tracking-tight">FinanceIQ</span>
          <button
            className="ml-auto lg:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground"
            onClick={() => setSidebarOpen(false)}
            data-testid="button-close-sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1" data-testid="nav-menu">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const active = location === path || (path !== "/" && location.startsWith(path));
            return (
              <Link
                key={path}
                href={path}
                onClick={() => setSidebarOpen(false)}
                data-testid={`nav-${label.toLowerCase()}`}
              >
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Role + Theme */}
        <div className="px-3 py-4 border-t border-sidebar-border space-y-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                data-testid="dropdown-role"
              >
                <span className="flex items-center gap-2">
                  {role === "admin" ? (
                    <Shield className="w-4 h-4 text-primary" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="capitalize">{role}</span>
                </span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => setRole("admin")}
                data-testid="role-admin"
                className="gap-2"
              >
                <Shield className="w-4 h-4 text-primary" />
                Admin
                {role === "admin" && (
                  <Badge variant="secondary" className="ml-auto text-xs">Active</Badge>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setRole("viewer")}
                data-testid="role-viewer"
                className="gap-2"
              >
                <Eye className="w-4 h-4 text-muted-foreground" />
                Viewer
                {role === "viewer" && (
                  <Badge variant="secondary" className="ml-auto text-xs">Active</Badge>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            data-testid="button-toggle-theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-foreground/60 hover:text-foreground"
            data-testid="button-open-sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-sm">FinanceIQ</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md text-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
              data-testid="button-toggle-theme-mobile"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
