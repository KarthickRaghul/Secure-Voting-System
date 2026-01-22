import type { DemoDatasetId } from "@/securecloud/types";

export function getDemoDataset(id: DemoDatasetId): { name: string; values: number[]; description: string } {
  switch (id) {
    case "secure_voting":
      return {
        name: "Secure Voting Dataset",
        description: "Toy votes dataset (0/1/2 values) for counting and summing.",
        values: [1, 0, 1, 1, 0, 1, 2, 1, 0, 1, 1, 0],
      };
    case "marks_analysis":
      return {
        name: "Marks Analysis Dataset",
        description: "Toy marks dataset (0–100) for sum/average.",
        values: [78, 92, 65, 84, 73, 88, 91, 56, 69, 77],
      };
  }
}
