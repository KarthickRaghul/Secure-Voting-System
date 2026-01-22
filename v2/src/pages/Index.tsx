// Update this page (the content is just a fallback if you fail to update the page)

import { Link } from "react-router-dom";
import { AppShell } from "@/securecloud/components/AppShell";
import { SecurityCallout } from "@/securecloud/components/SecurityCallout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <AppShell>
      <main className="mx-auto w-full max-w-5xl px-4 py-10">
        <header className="space-y-4">
          <h1 className="text-balance text-4xl font-semibold tracking-tight">SecureCloud Analytics</h1>
          <p className="max-w-2xl text-pretty text-base text-muted-foreground">
            A privacy-preserving analytics proof-of-concept: your dataset is encrypted in the browser, the cloud computes
            on ciphertext, and only your browser decrypts the result.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/datasets">Start demo</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/keys">Generate keys</Link>
            </Button>
          </div>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Workflow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <ol className="list-decimal space-y-1 pl-5">
                <li>Key Generation (client)</li>
                <li>Encryption (client)</li>
                <li>Cloud Computation (server on ciphertext)</li>
                <li>Decryption (client)</li>
              </ol>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Simulation mode</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                This demo uses a <span className="font-medium text-foreground">simulated</span> homomorphic scheme to
                demonstrate architecture and data flow. It is not cryptographically secure.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mt-6">
          <SecurityCallout
            title="Privacy guarantees (in this demo)"
            items={[
              "Private key stays in your browser (never uploaded)",
              "Server receives ciphertext only",
              "Server returns encrypted results only",
            ]}
          />
        </section>
      </main>
    </AppShell>
  );
};

export default Index;
