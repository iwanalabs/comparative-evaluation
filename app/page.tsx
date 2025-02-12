"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
import ComparisonContainer from "@/components/ComparisonContainer"
import JsonInput from "@/components/JsonInput"
import Navigation from "@/components/Navigation"
import type { Comparison } from "@/types"

export default function Home() {
  const [comparisons, setComparisons] = useState<Comparison[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userSelections, setUserSelections] = useState<Record<string, string>>({})
  const [userComments, setUserComments] = useState<Record<string, string>>({})
  const [respondedComparisons, setRespondedComparisons] = useState<Set<string>>(new Set())
  const [inputFilename, setInputFilename] = useState<string>("")

  const handleDataLoaded = (data: Comparison[], filename: string) => {
    setComparisons(data)
    setCurrentIndex(0)
    setUserSelections({})
    setUserComments({})
    setRespondedComparisons(new Set())
    setInputFilename(filename)
  }

  const handleSelection = (comparisonId: string, choice: string) => {
    setUserSelections((prev) => ({ ...prev, [comparisonId]: choice }))
    setRespondedComparisons((prev) => new Set(prev).add(comparisonId))
  }

  const handleCommentChange = (comparisonId: string, comment: string) => {
    setUserComments((prev) => ({ ...prev, [comparisonId]: comment }))
  }

  const handleNext = (index?: number) => {
    if (typeof index === 'number') {
      setCurrentIndex(index)
    } else {
      setCurrentIndex((prev) => Math.min(comparisons.length - 1, prev + 1))
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if focus is on an input or if meta/ctrl/alt are pressed
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.altKey || event.metaKey || event.ctrlKey
      ) {
        return
      }

      const currentComparisonId = comparisons[currentIndex]?.comparison_id

      switch (event.key) {
        case "1":
          if (currentComparisonId) {
            event.preventDefault()
            handleSelection(currentComparisonId, "left")
          }
          break
        case "2":
          if (currentComparisonId) {
            event.preventDefault()
            handleSelection(currentComparisonId, "right")
          }
          break
        case "3":
          if (currentComparisonId) {
            event.preventDefault()
            handleSelection(currentComparisonId, "tie")
          }
          break
        case "ArrowRight":
        case "Enter":
          event.preventDefault()
          handleNext()
          break
        case "ArrowLeft":
          event.preventDefault()
          setCurrentIndex((prev) => Math.max(0, prev - 1))
          break
        default:
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [comparisons, currentIndex])

  // Create a version of comparisons with comments for the current view
  const currentComparison = comparisons[currentIndex] ? {
    ...comparisons[currentIndex],
    comment: userComments[comparisons[currentIndex].comparison_id] || ""
  } : null

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <JsonInput 
          onDataLoaded={handleDataLoaded}
          userSelections={userSelections}
          userComments={userComments}
          comparisons={comparisons}
        />
        <Navigation
          currentIndex={currentIndex}
          totalComparisons={comparisons.length}
          onPrevious={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          onNext={handleNext}
          userSelections={userSelections}
          userComments={userComments}
          comparisons={comparisons}
          respondedComparisons={respondedComparisons}
          inputFilename={inputFilename}
        />
        {currentComparison && (
          <ComparisonContainer
            comparison={currentComparison}
            onSelection={handleSelection}
            onCommentChange={handleCommentChange}
            selectedChoice={userSelections[currentComparison.comparison_id]}
            isResponded={respondedComparisons.has(currentComparison.comparison_id)}
          />
        )}
      </main>
    </div>
  )
}
