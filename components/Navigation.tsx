import { Button } from "@/components/ui/button";
import type { Comparison } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type NavigationProps = {
  currentIndex: number;
  totalComparisons: number;
  onPrevious: () => void;
  onNext: (index?: number) => void;
  userSelections: Record<string, string>;
  userComments: Record<string, string>;
  comparisons: Comparison[];
  respondedComparisons: Set<string>;
};

export default function Navigation({
  currentIndex,
  totalComparisons,
  onPrevious,
  onNext,
  userSelections,
  userComments,
  comparisons,
  respondedComparisons,
}: NavigationProps) {
  const downloadResults = () => {
    const headers = [
      "comparison_id",
      "output_id",
      "chosen_side",
      "chosen_model_id",
      "comment"
    ];
    const rows = [headers];

    comparisons.forEach((comp) => {
      const compId = comp.comparison_id;
      const outId = comp.output_id;
      const choice = userSelections[compId] || "";
      const comment = userComments[compId] || "";
      let chosenModel = "";
      if (choice === "left") {
        chosenModel = comp.model_outputs[0].model_id;
      } else if (choice === "right") {
        chosenModel = comp.model_outputs[1].model_id;
      } else if (choice === "tie") {
        chosenModel = "tie";
      }
      rows.push([compId, outId, choice, chosenModel, comment]);
    });

    const csvContent = rows.map((r) => r.map(cell => 
      // Escape CSV special characters and wrap in quotes if needed
      cell.includes(',') || cell.includes('"') || cell.includes('\n') 
        ? `"${cell.replace(/"/g, '""')}"` 
        : cell
    ).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "pairwise_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="space-x-2">
          <Button onClick={onPrevious} disabled={currentIndex === 0}>
            Previous
          </Button>
          <Button
            onClick={() => onNext()}
            disabled={currentIndex === totalComparisons - 1}
          >
            Next
          </Button>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {totalComparisons > 0
            ? `${currentIndex + 1} / ${totalComparisons}`
            : "No comparisons loaded"}
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-block">
                <Button
                  onClick={downloadResults}
                  disabled={
                    totalComparisons === 0 ||
                    respondedComparisons.size !== totalComparisons
                  }
                  variant={
                    totalComparisons === 0 ||
                    respondedComparisons.size !== totalComparisons
                      ? "secondary"
                      : "default"
                  }
                >
                  Download Results
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {totalComparisons === 0
                ? "No comparisons loaded"
                : respondedComparisons.size !== totalComparisons
                ? `Please answer all ${totalComparisons} questions before downloading`
                : "Download your results"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="space-y-2">
        <div className="flex justify-center text-sm text-gray-600 dark:text-gray-400">
          <span>
            {respondedComparisons.size} / {totalComparisons} responded
          </span>
        </div>
        <div className="flex gap-1.5 flex-wrap justify-center">
          {comparisons.map((comp, index) => (
            <div
              key={comp.comparison_id}
              className={`h-3 w-12 rounded transition-colors cursor-pointer ${
                respondedComparisons.has(comp.comparison_id)
                  ? "bg-primary"
                  : "bg-secondary"
              } ${
                currentIndex === index
                  ? "ring-1 ring-primary ring-offset-1"
                  : ""
              }`}
              title={`Question ${index + 1}${
                respondedComparisons.has(comp.comparison_id)
                  ? " - Answered"
                  : " - Not answered"
              }`}
              onClick={() => onNext(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
