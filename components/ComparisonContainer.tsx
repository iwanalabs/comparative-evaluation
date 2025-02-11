import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Comparison } from "@/types";
import { Badge } from "@/components/ui/badge";

type ComparisonContainerProps = {
  comparison: Comparison;
  onSelection: (comparisonId: string, choice: string) => void;
  onCommentChange: (comparisonId: string, comment: string) => void;
  selectedChoice: string | undefined;
  isResponded: boolean;
};

export default function ComparisonContainer({
  comparison,
  onSelection,
  onCommentChange,
  selectedChoice,
  isResponded,
}: ComparisonContainerProps) {
  return (
    <Card className="mb-8">
      <CardHeader className="py-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-gray-400 text-sm font-normal">
            Output ID: {comparison.output_id}
          </CardTitle>
          {isResponded && <Badge variant="outline">Responded</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {comparison.model_outputs.map((output, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">
                Answer {index === 0 ? "1" : "2"}
              </h3>
              <p className="whitespace-pre-wrap">{output.text}</p>
            </div>
          ))}
        </div>
        <h4 className="text-center font-medium mb-4 mt-6">
          Which answer do you prefer?
        </h4>
        <RadioGroup
          className="flex justify-center space-x-4 mt-6"
          value={selectedChoice || ""}
          onValueChange={(value) =>
            onSelection(comparison.comparison_id, value)
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="left" id="left" />
            <Label htmlFor="left">Answer 1</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="right" id="right" />
            <Label htmlFor="right">Answer 2</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="tie" id="tie" />
            <Label htmlFor="tie">Tie</Label>
          </div>
        </RadioGroup>
        <div className="mt-6">
          <Label htmlFor="comment" className="text-sm font-medium">
            Comments (optional)
          </Label>
          <Textarea
            id="comment"
            placeholder="Add any comments or explanations about your choice..."
            className="mt-2"
            value={comparison.comment || ""}
            onChange={(e) =>
              onCommentChange(comparison.comparison_id, e.target.value)
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
