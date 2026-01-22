import * as React from "react";
import { AppShell } from "@/securecloud/components/AppShell";
import { StepIndicator } from "@/securecloud/components/StepIndicator";
import { useSecureCloudSteps } from "@/securecloud/pages/_steps";
import { useSecureCloud } from "@/securecloud/SecureCloudProvider";
import { getDemoDataset } from "@/securecloud/datasets";
import { parseCsvNumbers } from "@/securecloud/lib/csv";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export default function DatasetPage() {
  const steps = useSecureCloudSteps();
  const { toast } = useToast();
  const { plaintextNumbers, setPlaintextNumbers } = useSecureCloud();

  const [manual, setManual] = React.useState<string>(plaintextNumbers.join(", "));
  const [csvText, setCsvText] = React.useState<string>("");

  function applyDemo(id: "secure_voting" | "marks_analysis") {
    const demo = getDemoDataset(id);
    setPlaintextNumbers(demo.values);
    setManual(demo.values.join(", "));
    toast({ title: "Loaded demo dataset", description: demo.name });
  }

  function applyManual() {
    const parts = manual
      .split(/[,\n\t ]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const values: number[] = [];
    for (const p of parts) {
      const n = Number(p);
      if (!Number.isFinite(n)) {
        toast({ title: "Invalid number", description: `"${p}" is not numeric.`, variant: "destructive" });
        return;
      }
      values.push(n);
    }
    if (values.length === 0) {
      toast({ title: "No values", description: "Enter at least one number.", variant: "destructive" });
      return;
    }
    setPlaintextNumbers(values);
    toast({ title: "Dataset updated", description: `${values.length} numbers loaded.` });
  }

  async function applyCsvFile(file: File | null) {
    if (!file) return;
    const text = await file.text();
    setCsvText(text);
    const parsed = parseCsvNumbers(text);
    if (parsed.values.length === 0) {
      toast({ title: "CSV import failed", description: parsed.warnings.join(" • "), variant: "destructive" });
      return;
    }
    setPlaintextNumbers(parsed.values);
    setManual(parsed.values.join(", "));
    toast({ title: "CSV imported", description: `${parsed.values.length} numbers loaded.` });
    if (parsed.warnings.length) {
      toast({ title: "CSV warnings", description: parsed.warnings.slice(0, 3).join(" • ") });
    }
  }

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
        <StepIndicator steps={steps} />

        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Dataset</h1>
          <p className="text-sm text-muted-foreground">Choose a demo dataset, upload CSV, or enter numbers manually.</p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Demo datasets</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button variant="secondary" onClick={() => applyDemo("secure_voting")}>
                Load Secure Voting Dataset
              </Button>
              <Button variant="secondary" onClick={() => applyDemo("marks_analysis")}>
                Load Marks Analysis Dataset
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CSV upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="csv">CSV file (first column numeric)</Label>
                <Input id="csv" type="file" accept=".csv,text/csv" onChange={(e) => applyCsvFile(e.target.files?.[0] ?? null)} />
              </div>
              <Textarea
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="CSV preview..."
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Manual input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              placeholder="Example: 10, 20, 30"
              className="min-h-[120px]"
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={applyManual}>Use these numbers</Button>
              <Button asChild variant="secondary" disabled={plaintextNumbers.length === 0}>
                <Link to="/keys">Next: Generate keys</Link>
              </Button>
              <span className="text-sm text-muted-foreground">Loaded: {plaintextNumbers.length} values</span>
            </div>
          </CardContent>
        </Card>
      </main>
    </AppShell>
  );
}
