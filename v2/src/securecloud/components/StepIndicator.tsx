import { cn } from "@/lib/utils";

export type Step = {
  key: string;
  label: string;
  done: boolean;
  current: boolean;
};

export function StepIndicator({ steps }: { steps: Step[] }) {
  return (
    <div className="w-full">
      <ol className="grid gap-2 sm:grid-cols-6">
        {steps.map((s) => (
          <li
            key={s.key}
            className={cn(
              "rounded-md border px-3 py-2 text-xs",
              s.current && "border-ring",
              s.done && !s.current && "bg-muted",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className={cn("font-medium", s.current ? "text-foreground" : "text-muted-foreground")}>{s.label}</span>
              <span className={cn("text-muted-foreground", s.done && "text-foreground")}>{s.done ? "✓" : ""}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
