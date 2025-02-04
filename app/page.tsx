"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import ComparisonContainer from "@/components/ComparisonContainer"
import JsonInput from "@/components/JsonInput"
import Navigation from "@/components/Navigation"
import type { Comparison } from "@/types"

export default function Home() {
  const [comparisons, setComparisons] = useState<Comparison[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userSelections, setUserSelections] = useState<Record<string, string>>({})
  const [respondedComparisons, setRespondedComparisons] = useState<Set<string>>(new Set())

  const handleDataLoaded = (data: Comparison[]) => {
    setComparisons(data)
    setCurrentIndex(0)
    setUserSelections({})
    setRespondedComparisons(new Set())
  }

  const handleSelection = (comparisonId: string, choice: string) => {
    setUserSelections((prev) => ({ ...prev, [comparisonId]: choice }))
    setRespondedComparisons((prev) => new Set(prev).add(comparisonId))
  }

  const handleNext = (index?: number) => {
    if (typeof index === 'number') {
      setCurrentIndex(index)
    } else {
      setCurrentIndex((prev) => Math.min(comparisons.length - 1, prev + 1))
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <JsonInput onDataLoaded={handleDataLoaded} />
        <Navigation
          currentIndex={currentIndex}
          totalComparisons={comparisons.length}
          onPrevious={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          onNext={handleNext}
          userSelections={userSelections}
          comparisons={comparisons}
          respondedComparisons={respondedComparisons}
        />
        {comparisons.length > 0 && (
          <ComparisonContainer
            comparison={comparisons[currentIndex]}
            onSelection={handleSelection}
            selectedChoice={userSelections[comparisons[currentIndex].comparison_id]}
            isResponded={respondedComparisons.has(comparisons[currentIndex].comparison_id)}
          />
        )}
      </main>
    </div>
  )
}

