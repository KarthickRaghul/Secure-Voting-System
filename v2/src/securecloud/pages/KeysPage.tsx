import * as React from "react";
import { AppShell } from "@/securecloud/components/AppShell";
import { StepIndicator } from "@/securecloud/components/StepIndicator";
import { useSecureCloudSteps } from "@/securecloud/pages/_steps";
import { SecurityCallout } from "@/securecloud/components/SecurityCallout";
import { useSecureCloud } from "@/securecloud/SecureCloudProvider";
import { generateKeypair } from "@/securecloud/lib/simulatedHe";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export default function KeysPage() {
  const steps = useSecureCloudSteps();
  const { plaintextNumbers, keypair, setKeypair } = useSecureCloud();
  const [reveal, setReveal] = React.useState(false);

  function onGenerate() {
    setKeypair(generateKeypair());
    setReveal(false);
  }

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
        <StepIndicator steps={steps} />
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Key Generation</h1>
          <p className="text-sm text-muted-foreground">
            Keys are generated in your browser. The private key never leaves the client.
          </p>
        </header>

        <SecurityCallout
          title="Important"
          items={["Do not upload the private key", "Only the public key can be shared with the server"]}
        />

        <Card>
          <CardHeader>
            <CardTitle>Generate keys (simulation)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button onClick={onGenerate}>Generate new keypair</Button>
              <Button asChild variant="secondary" disabled={!keypair || plaintextNumbers.length === 0}>
                <Link to="/encrypt">Next: Encrypt dataset</Link>
              </Button>
              <Button asChild variant="secondary" disabled={plaintextNumbers.length === 0}>
                <Link to="/datasets">Back: Dataset</Link>
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Public key (safe to send)</Label>
                <Input
                  readOnly
                  value={keypair?.publicKey || ""}
                  placeholder="Generate keys to see public key"
                  className="font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label>Private key (keep secret)</Label>
                <Input
                  readOnly
                  type={reveal ? "text" : "password"}
                  value={keypair?.privateKey || ""}
                  placeholder="Generate keys to see private key"
                  className="font-mono text-xs"
                />
                <div className="flex items-center gap-2">
                  <input
                    id="reveal"
                    type="checkbox"
                    className="h-4 w-4"
                    checked={reveal}
                    onChange={(e) => setReveal(e.target.checked)}
                    disabled={!keypair}
                  />
                  <Label htmlFor="reveal">Reveal private key</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </AppShell >
  );
}
