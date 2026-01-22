import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSecureCloud } from "@/securecloud/SecureCloudProvider";
import { secureCloudRoutes } from "@/securecloud/routes";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { resetAll } = useSecureCloud();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-4">
            <NavLink
              to={secureCloudRoutes.home}
              className="text-sm font-semibold tracking-tight"
              activeClassName="text-foreground"
            >
              SecureCloud Analytics
            </NavLink>
            <Separator orientation="vertical" className="h-5" />
            <nav className="hidden items-center gap-3 md:flex">
              <NavLink
                to={secureCloudRoutes.datasets}
                className="text-sm text-muted-foreground hover:text-foreground"
                activeClassName="text-foreground"
              >
                Datasets
              </NavLink>
              <NavLink
                to={secureCloudRoutes.keys}
                className="text-sm text-muted-foreground hover:text-foreground"
                activeClassName="text-foreground"
              >
                Keys
              </NavLink>
              <NavLink
                to={secureCloudRoutes.encrypt}
                className="text-sm text-muted-foreground hover:text-foreground"
                activeClassName="text-foreground"
              >
                Encrypt
              </NavLink>
              <NavLink
                to={secureCloudRoutes.send}
                className="text-sm text-muted-foreground hover:text-foreground"
                activeClassName="text-foreground"
              >
                Send
              </NavLink>
              <NavLink
                to={secureCloudRoutes.compute}
                className="text-sm text-muted-foreground hover:text-foreground"
                activeClassName="text-foreground"
              >
                Compute
              </NavLink>
              <NavLink
                to={secureCloudRoutes.result}
                className="text-sm text-muted-foreground hover:text-foreground"
                activeClassName="text-foreground"
              >
                Result
              </NavLink>
            </nav>
          </div>
          <Button variant="secondary" onClick={resetAll}>
            Reset demo
          </Button>
        </div>
      </header>

      {children}
    </div>
  );
}
