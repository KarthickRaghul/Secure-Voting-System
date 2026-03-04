import type { DemoDatasetId } from "@/securecloud/types";

export function getDemoDataset(id: DemoDatasetId): { name: string; values: number[]; description: string } {
  switch (id) {
    case "secure_voting":
      return {
        name: "Secure Voting Dataset",
        description: "Large-scale demographic voting data simulation (0/1/2 values).",
        // Generating 100 values for "large" feel
        values: Array.from({ length: 120 }, () => Math.floor(Math.random() * 3)),
      };
    case "marks_analysis":
      return {
        name: "Marks Analysis Dataset",
        description: "Comprehensive student performance metric simulation (0–100).",
        // Generating 100 values
        values: Array.from({ length: 100 }, () => Math.floor(Math.random() * 61) + 40), // 40-100
      };
  }
}

