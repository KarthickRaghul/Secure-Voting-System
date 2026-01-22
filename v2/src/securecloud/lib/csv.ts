import { z } from "zod";

const csvNumbersSchema = z
  .array(z.number().finite())
  .min(1, { message: "Provide at least one number." })
  .max(5000, { message: "Too many rows (max 5000)." });

export function parseCsvNumbers(text: string): { values: number[]; warnings: string[] } {
  const warnings: string[] = [];
  const trimmed = text.trim();
  if (!trimmed) return { values: [], warnings: ["CSV is empty."] };

  const lines = trimmed.split(/\r?\n/);
  const values: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].trim();
    if (!raw) continue;

    // Accept either a single column or comma-separated: take first cell.
    const firstCell = raw.split(",")[0]?.trim() ?? "";
    const n = Number(firstCell);
    if (!Number.isFinite(n)) {
      warnings.push(`Row ${i + 1}: not a number ("${firstCell}")`);
      continue;
    }
    values.push(n);
  }

  const parsed = csvNumbersSchema.safeParse(values);
  if (!parsed.success) {
    return { values: [], warnings: [...warnings, parsed.error.issues[0]?.message ?? "Invalid CSV."] };
  }
  return { values: parsed.data, warnings };
}
