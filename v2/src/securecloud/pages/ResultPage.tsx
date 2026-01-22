import * as React from "react";
import { AppShell } from "@/securecloud/components/AppShell";
import { StepIndicator } from "@/securecloud/components/StepIndicator";
import { useSecureCloudSteps } from "@/securecloud/pages/_steps";
import { useSecureCloud } from "@/securecloud/SecureCloudProvider";
import { decryptNumber } from "@/securecloud/lib/simulatedHe";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function ResultPage() {
  const steps = useSecureCloudSteps();
  const { toast } = useToast();
  const { keypair, lastServerResult, addDecryptedResult, decryptedHistory } = useSecureCloud();
  const [lastValue, setLastValue] = React.useState<number | null>(null);

  const canDecrypt = !!keypair && !!lastServerResult;

  function onDecrypt() {
    if (!keypair || !lastServerResult) return;
    const decrypted = decryptNumber(lastServerResult.encrypted, keypair.privateKey);
    // For avg, server returns encrypted sum + meta.count; client divides after decrypt.
    const count = Number((lastServerResult.meta as any)?.count ?? 0);
    const value = lastServerResult.op === "avg" && count > 0 ? decrypted / count : decrypted;
    setLastValue(value);
    addDecryptedResult({ op: lastServerResult.op, value, decryptedAt: new Date().toISOString() });
    toast({ title: "Decrypted in browser", description: `Result: ${value}` });
  }

  const chartData = decryptedHistory
    .slice(0, 6)
    .reverse()
    .map((r, idx) => ({ name: `${r.op.toUpperCase()} #${idx + 1}`, value: r.value }));

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
        <StepIndicator steps={steps} />
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Decrypt & Visualize</h1>
          <p className="text-sm text-muted-foreground">Decryption happens only on the client using the private key.</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Decrypt result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button onClick={onDecrypt} disabled={!canDecrypt}>
                Decrypt in browser
              </Button>
              <Button asChild variant="secondary">
                <Link to="/compute">Back: Compute</Link>
              </Button>
            </div>

            <div className="text-sm">
              <span className="text-muted-foreground">Latest decrypted value:</span>{" "}
              <span className="font-mono">{lastValue ?? "—"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results history</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" hide />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Op</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {decryptedHistory.slice(0, 8).map((r) => (
                    <TableRow key={r.decryptedAt + r.op}>
                      <TableCell className="font-mono">{r.op}</TableCell>
                      <TableCell className="font-mono">{r.value}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(r.decryptedAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  {decryptedHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-sm text-muted-foreground">
                        No decrypted results yet.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </AppShell>
  );
}
