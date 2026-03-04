import { AppShell } from "@/securecloud/components/AppShell";
import { StepIndicator } from "@/securecloud/components/StepIndicator";
import { useSecureCloudSteps } from "@/securecloud/pages/_steps";
import { useSecureCloud } from "@/securecloud/SecureCloudProvider";
import { encryptNumber } from "@/securecloud/lib/simulatedHe";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function EncryptPage() {
  const steps = useSecureCloudSteps();
  const { toast } = useToast();
  const { plaintextNumbers, keypair, ciphertextNumbers, setCiphertextNumbers } = useSecureCloud();

  const canEncrypt = plaintextNumbers.length > 0 && !!keypair;

  function onEncrypt() {
    if (!keypair) return;
    const encrypted = plaintextNumbers.map((n) => encryptNumber(n, keypair.publicKey));
    setCiphertextNumbers(encrypted);
    toast({ title: "Encrypted", description: `${encrypted.length} values encrypted in the browser.` });
  }

  const preview = plaintextNumbers.slice(0, 8).map((p, i) => ({ p, c: ciphertextNumbers[i] }));

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
        <StepIndicator steps={steps} />
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Encrypt Dataset</h1>
          <p className="text-sm text-muted-foreground">
            Encryption happens on the client. Only ciphertext will be sent to the server.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Encrypt (simulation)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button onClick={onEncrypt} disabled={!canEncrypt}>
                Encrypt now
              </Button>
              <Button asChild variant="secondary" disabled={ciphertextNumbers.length === 0}>
                <Link to="/send">Next: Send ciphertext</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/keys">Back: Keys</Link>
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              Loaded: {plaintextNumbers.length} plaintext values • Encrypted: {ciphertextNumbers.length}
            </div>

            <div className="rounded-xl border bg-muted/20">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Plaintext</TableHead>
                    <TableHead>Ciphertext (c)</TableHead>
                    <TableHead>Nonce</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ciphertextNumbers.length > 0 ? (
                    plaintextNumbers.slice(0, 10).map((p, i) => {
                      const c = ciphertextNumbers[i];
                      return (
                        <TableRow key={i} className="group transition-colors hover:bg-muted/50">
                          <TableCell className="font-mono text-sm">{p}</TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {c ? "0x" + c.c.toString(16).toUpperCase().padStart(16, "0") : "—"}
                          </TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {c ? "0x" + c.nonce.toString(16).toUpperCase().padStart(8, "0") : "—"}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center text-sm text-muted-foreground">
                        Encrypt the dataset to see ciphertexts
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {plaintextNumbers.length > 10 && (
              <p className="text-center text-xs text-muted-foreground italic">
                Showing first 10 rows of {plaintextNumbers.length}. All values are encrypted.
              </p>
            )}

          </CardContent>
        </Card>
      </main>
    </AppShell>
  );
}
