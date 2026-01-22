import * as React from "react";
import { AppShell } from "@/securecloud/components/AppShell";
import { StepIndicator } from "@/securecloud/components/StepIndicator";
import { useSecureCloudSteps } from "@/securecloud/pages/_steps";
import { useSecureCloud } from "@/securecloud/SecureCloudProvider";
import { computeEncrypted } from "@/securecloud/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function ComputePage() {
  const steps = useSecureCloudSteps();
  const { toast } = useToast();
  const { datasetId, setLastServerResult, lastServerResult } = useSecureCloud();
  const [busyOp, setBusyOp] = React.useState<null | "sum" | "avg" | "count">(null);

  async function run(op: "sum" | "avg" | "count") {
    if (!datasetId) return;
    setBusyOp(op);
    try {
      const res = await computeEncrypted(op, { datasetId });
      setLastServerResult(res);
      toast({ title: "Server computed on ciphertext", description: `Operation: ${op}` });
    } catch (e: any) {
      toast({ title: "Compute failed", description: e?.message ?? "Unknown error", variant: "destructive" });
    } finally {
      setBusyOp(null);
    }
  }

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
        <StepIndicator steps={steps} />
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Cloud Computation</h1>
          <p className="text-sm text-muted-foreground">Choose an operation. The server returns an encrypted result.</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Operations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => run("sum")} disabled={!datasetId || !!busyOp}>
                {busyOp === "sum" ? "Computing…" : "Encrypted Sum"}
              </Button>
              <Button onClick={() => run("avg")} disabled={!datasetId || !!busyOp}>
                {busyOp === "avg" ? "Computing…" : "Encrypted Average"}
              </Button>
              <Button onClick={() => run("count")} disabled={!datasetId || !!busyOp}>
                {busyOp === "count" ? "Computing…" : "Encrypted Count"}
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">Last encrypted result: {lastServerResult ? lastServerResult.op : "—"}</div>

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="secondary" disabled={!lastServerResult}>
                <Link to="/result">Next: Decrypt</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/send">Back: Send</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </AppShell>
  );
}
