import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Comparison } from "@/types"

type JsonInputProps = {
  onDataLoaded: (data: Comparison[], filename: string) => void;
  userSelections?: Record<string, string>;
  userComments?: Record<string, string>;
  comparisons?: Comparison[];
}

export default function JsonInput({ 
  onDataLoaded, 
  userSelections = {}, 
  userComments = {}, 
  comparisons = [] 
}: JsonInputProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string)
          prepareData(jsonData, file.name)
        } catch (err) {
          alert("Invalid JSON file.")
        }
      }
      reader.readAsText(file)
    }
  }

  const prepareData = (jsonData: Comparison[], filename: string) => {
    // Shuffle the list of comparisons
    const shuffled = [...jsonData].sort(() => Math.random() - 0.5)

    // Randomize left vs right
    shuffled.forEach((item) => {
      if (Math.random() < 0.5) {
        const temp = item.model_outputs[0]
        item.model_outputs[0] = item.model_outputs[1]
        item.model_outputs[1] = temp
      }
    })

    onDataLoaded(shuffled, filename)
  }

  return (
    <div className="space-y-4 mb-8">
      <div>
        <Label htmlFor="jsonFile">Load JSON file</Label>
        <Input id="jsonFile" type="file" accept=".json" onChange={handleFileUpload} />
      </div>
    </div>
  )
}

