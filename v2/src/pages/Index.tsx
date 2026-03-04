import { Link } from "react-router-dom";
import { AppShell } from "@/securecloud/components/AppShell";
import { SecurityCallout } from "@/securecloud/components/SecurityCallout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, ShieldCheck, Zap, Globe, Lock } from "lucide-react";

const Index = () => {
  return (
    <AppShell>
      <main className="px-4 py-16 sm:py-24">
        {/* Hero Section */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground animate-in fade-in slide-in-from-top-4 duration-1000">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            V2 Beta Now Live
          </div>
          <h1 className="mt-8 text-balance text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Privacy-Preserving <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Cloud Analytics
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
            Compute on your data without ever revealing it. Our simulated Homomorphic Encryption ensures your private keys never leave your browser.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
              <Link to="/datasets" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 transition-all hover:bg-accent hover:text-foreground">
              <Link to="/keys">Generate Keys</Link>
            </Button>
          </div>
        </div>

        {/* Feature Grid */}
        <section className="mt-24 grid gap-8 md:grid-cols-3">
          <FeatureCard
            icon={<ShieldCheck className="h-6 w-6 text-primary" />}
            title="End-to-End Privacy"
            description="Your dataset is encrypted locally in the browser. The cloud only ever sees ciphertext."
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6 text-primary" />}
            title="Instant Computation"
            description="Perform sums, averages, and counts on encrypted data with near-zero latency in this demo."
          />
          <FeatureCard
            icon={<Globe className="h-6 w-6 text-primary" />}
            title="Cloud Ready"
            description="Designed for a future where data privacy is the default, not an afterthought."
          />
        </section>

        {/* Workflow & Tech */}
        <div className="mt-24 grid gap-8 lg:grid-cols-2">
          <Card className="border-primary/10 bg-gradient-to-br from-background to-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security Protocol
              </CardTitle>
              <CardDescription>How the homomorphic simulation works</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {[
                  { step: "01", text: "Key Generation (Client-side localized)" },
                  { step: "02", text: "Encryption (Browser-level processing)" },
                  { step: "03", text: "Cloud Uplink (Ciphertext transmission)" },
                  { step: "04", text: "Homomorphic Tally (Server-side compute)" },
                  { step: "05", text: "Secure Decryption (Client-only results)" }
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-primary/40">{item.step}</span>
                    <span className="text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col justify-center space-y-6">
            <SecurityCallout
              title="Demo Guarantees"
              items={[
                "Private keys are stored only in RAM (discarded on refresh)",
                "Server operations are mathematically opaque without keys",
                "Results are delivered as ciphertexts to the requester",
              ]}
            />
            <div className="rounded-xl border border-dashed p-6 text-center">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Educational Notice</h3>
              <p className="mt-2 text-sm text-muted-foreground italic">
                "This project uses a simulated homomorphic scheme for demonstration. For production systems, use audited libraries like Microsoft SEAL or OpenFHE."
              </p>
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
};

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group rounded-2xl border p-8 transition-all hover:border-primary/20 hover:bg-primary/[0.02]">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-transform group-hover:scale-110">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

export default Index;

