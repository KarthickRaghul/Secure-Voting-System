import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSecureCloud } from "@/securecloud/SecureCloudProvider";
import { secureCloudRoutes } from "@/securecloud/routes";
import { Shield, Database, Key, Lock, Send, Cpu, PieChart, RefreshCw } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { resetAll } = useSecureCloud();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background font-sans selection:bg-primary/10">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -right-[10%] bottom-[10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-6">
            <NavLink
              to={secureCloudRoutes.home}
              className="flex items-center gap-2 text-base font-bold tracking-tight transition-opacity hover:opacity-80"
              activeClassName="text-foreground"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Shield className="h-5 w-5" />
              </div>
              <span className="hidden sm:inline">SecureCloud</span>
            </NavLink>

            <Separator orientation="vertical" className="h-6" />

            <nav className="hidden items-center gap-1 md:flex">
              <NavOption to={secureCloudRoutes.datasets} icon={<Database className="h-4 w-4" />} label="Datasets" />
              <NavOption to={secureCloudRoutes.keys} icon={<Key className="h-4 w-4" />} label="Keys" />
              <NavOption to={secureCloudRoutes.encrypt} icon={<Lock className="h-4 w-4" />} label="Encrypt" />
              <NavOption to={secureCloudRoutes.send} icon={<Send className="h-4 w-4" />} label="Send" />
              <NavOption to={secureCloudRoutes.compute} icon={<Cpu className="h-4 w-4" />} label="Compute" />
              <NavOption to={secureCloudRoutes.result} icon={<PieChart className="h-4 w-4" />} label="Results" />
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetAll}
              className="group gap-2 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30"
            >
              <RefreshCw className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        {children}
      </div>

      <footer className="relative z-10 border-t py-12 mt-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted">
              <Shield className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SecureCloud Analytics.
            Built for privacy-preserving data insights.
          </p>
          <div className="mt-4 flex justify-center gap-6 text-xs text-muted-foreground font-medium">
            <span className="transition-colors hover:text-foreground cursor-default">Simulation Mode</span>
            <span>•</span>
            <span className="transition-colors hover:text-foreground cursor-default">Homomorphic Encryption</span>
            <span>•</span>
            <span className="transition-colors hover:text-foreground cursor-default">V2 Alpha</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavOption({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
      activeClassName="bg-accent text-foreground shadow-sm"
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

