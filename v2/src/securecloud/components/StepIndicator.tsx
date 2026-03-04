import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export type Step = {
  key: string;
  label: string;
  done: boolean;
  current: boolean;
};

export function StepIndicator({ steps }: { steps: Step[] }) {
  return (
    <div className="w-full">
      <nav aria-label="Progress">
        <ol className="flex flex-wrap items-center gap-2">
          {steps.map((s, idx) => (
            <li key={s.key} className="flex items-center">
              <div
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 transition-all",
                  s.current
                    ? "border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary/20"
                    : s.done
                      ? "border-primary/20 bg-primary/5 text-primary/80"
                      : "border-muted bg-muted/30 text-muted-foreground"
                )}
              >
                <span className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                  s.current ? "bg-primary text-primary-foreground" : s.done ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  {s.done ? <Check className="h-3 w-3" /> : idx + 1}
                </span>
                <span className="text-xs font-semibold tracking-tight">{s.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className="mx-1 h-px w-4 bg-border/50 hidden sm:block" />
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}

