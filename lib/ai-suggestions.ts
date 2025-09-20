import type { ProcessedData } from "./excel-processor"

export interface AISuggestion {
  id: string
  category: string
  issue: string
  suggestion: string
  priority: "high" | "medium" | "low"
  impact: string
  actionItems: string[]
  timeframe: string
  metrics: string[]
  confidence: number
}

export interface SuggestionAnalysis {
  suggestions: AISuggestion[]
  summary: {
    totalIssues: number
    highPriorityCount: number
    estimatedImpact: string
    keyFocusAreas: string[]
  }
}

export function generateAISuggestions(data: ProcessedData): SuggestionAnalysis {
  const suggestions: AISuggestion[] = []
  let suggestionId = 1

  // Analyze negative keywords for specific suggestions
  const negativeWords = data.words.filter((word) => word.sentiment === "negative" && word.count > 2)
  const totalNegativeWords = negativeWords.reduce((sum, word) => sum + word.count, 0)

  negativeWords.forEach((word) => {
    const frequency = word.count / data.stats.totalReviews
    const confidence = Math.min(frequency * 10, 1) // Higher confidence with higher frequency

    switch (word.text) {
      case "slow":
      case "delayed":
        suggestions.push({
          id: `suggestion-${suggestionId++}`,
          category: "Delivery & Logistics",
          issue: `${word.count} customers (${Math.round(frequency * 100)}%) complained about ${word.text} delivery`,
          suggestion: "Optimize delivery operations and set clearer expectations",
          priority: word.count > 10 ? "high" : "medium",
          impact: "15-25% improvement in delivery satisfaction",
          actionItems: [
            "Partner with faster shipping providers",
            "Implement real-time tracking notifications",
            "Offer expedited shipping options",
            "Set realistic delivery timeframes",
            "Create delivery status dashboard",
          ],
          timeframe: "2-4 weeks",
          metrics: ["Average delivery time", "On-time delivery rate", "Customer satisfaction scores"],
          confidence,
        })
        break

      case "expensive":
      case "costly":
      case "overpriced":
        suggestions.push({
          id: `suggestion-${suggestionId++}`,
          category: "Pricing Strategy",
          issue: `${word.count} customers (${Math.round(frequency * 100)}%) find pricing too high`,
          suggestion: "Implement value-based pricing strategy and communicate value better",
          priority: word.count > 8 ? "high" : "medium",
          impact: "10-20% increase in price acceptance",
          actionItems: [
            "Create value comparison charts",
            "Introduce tiered pricing options",
            "Offer loyalty discounts",
            "Bundle products for better value",
            "Highlight unique value propositions",
          ],
          timeframe: "1-3 weeks",
          metrics: ["Price objection rate", "Conversion rate", "Customer lifetime value"],
          confidence,
        })
        break

      case "broken":
      case "defective":
      case "poor":
      case "faulty":
        suggestions.push({
          id: `suggestion-${suggestionId++}`,
          category: "Product Quality",
          issue: `${word.count} quality issues reported (${Math.round(frequency * 100)}% of reviews)`,
          suggestion: "Strengthen quality assurance and product testing processes",
          priority: "high",
          impact: "20-30% reduction in quality complaints",
          actionItems: [
            "Implement stricter QA testing protocols",
            "Increase pre-shipment inspections",
            "Offer extended warranties",
            "Create quality feedback loop",
            "Train manufacturing partners",
          ],
          timeframe: "4-8 weeks",
          metrics: ["Defect rate", "Return rate", "Quality satisfaction scores"],
          confidence,
        })
        break

      case "rude":
      case "unhelpful":
      case "unprofessional":
        suggestions.push({
          id: `suggestion-${suggestionId++}`,
          category: "Customer Service",
          issue: `${word.count} customers experienced poor service interactions`,
          suggestion: "Enhance customer service training and support processes",
          priority: word.count > 5 ? "high" : "medium",
          impact: "25-35% improvement in service satisfaction",
          actionItems: [
            "Implement customer service training program",
            "Create service quality guidelines",
            "Monitor service interactions",
            "Establish escalation procedures",
            "Reward excellent service performance",
          ],
          timeframe: "3-6 weeks",
          metrics: ["Service satisfaction scores", "Response time", "Resolution rate"],
          confidence,
        })
        break

      case "confusing":
      case "complicated":
      case "difficult":
        suggestions.push({
          id: `suggestion-${suggestionId++}`,
          category: "User Experience",
          issue: `${word.count} customers found the experience confusing or difficult`,
          suggestion: "Simplify user experience and improve onboarding",
          priority: "medium",
          impact: "15-25% improvement in user satisfaction",
          actionItems: [
            "Redesign user interface for clarity",
            "Create step-by-step guides",
            "Implement progressive disclosure",
            "Add contextual help",
            "Conduct usability testing",
          ],
          timeframe: "4-8 weeks",
          metrics: ["Task completion rate", "User satisfaction", "Support ticket volume"],
          confidence,
        })
        break
    }
  })

  // Analyze category-specific patterns
  data.chartData.forEach((category) => {
    const totalCategoryReviews = category.positive + category.negative + category.neutral
    const negativeRatio = category.negative / totalCategoryReviews

    if (negativeRatio > 0.3 && category.negative > 3) {
      const severity = negativeRatio > 0.5 ? "critical" : "significant"

      suggestions.push({
        id: `suggestion-${suggestionId++}`,
        category: `${category.category} Operations`,
        issue: `${severity} negative sentiment in ${category.category} (${Math.round(negativeRatio * 100)}% negative)`,
        suggestion: `Conduct comprehensive ${category.category.toLowerCase()} process review and improvement`,
        priority: negativeRatio > 0.5 ? "high" : "medium",
        impact: `20-40% improvement in ${category.category.toLowerCase()} satisfaction`,
        actionItems: [
          `Audit current ${category.category.toLowerCase()} processes`,
          "Identify specific pain points",
          "Implement process improvements",
          "Train team on new procedures",
          "Monitor improvement metrics",
        ],
        timeframe: "6-12 weeks",
        metrics: [`${category.category} satisfaction`, "Process efficiency", "Error rate"],
        confidence: Math.min(negativeRatio * 2, 1),
      })
    }
  })

  // Analyze overall sentiment trends
  const overallNegativeRatio = data.stats.negativeReviews / data.stats.totalReviews
  if (overallNegativeRatio > 0.25) {
    suggestions.push({
      id: `suggestion-${suggestionId++}`,
      category: "Strategic Initiative",
      issue: `High overall negative sentiment (${Math.round(overallNegativeRatio * 100)}% of reviews)`,
      suggestion: "Launch comprehensive customer experience improvement program",
      priority: "high",
      impact: "30-50% improvement in overall satisfaction",
      actionItems: [
        "Form cross-functional improvement team",
        "Conduct customer journey mapping",
        "Implement customer feedback system",
        "Create improvement roadmap",
        "Establish regular review cycles",
      ],
      timeframe: "8-16 weeks",
      metrics: ["Overall satisfaction", "Net Promoter Score", "Customer retention"],
      confidence: overallNegativeRatio,
    })
  }

  // Remove duplicates and prioritize
  const uniqueSuggestions = suggestions.filter(
    (suggestion, index, self) =>
      index === self.findIndex((s) => s.category === suggestion.category && s.issue === suggestion.issue),
  )

  // Sort by priority and confidence
  const prioritizedSuggestions = uniqueSuggestions
    .sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 }
      const aPriority = priorityWeight[a.priority]
      const bPriority = priorityWeight[b.priority]

      if (aPriority !== bPriority) return bPriority - aPriority
      return b.confidence - a.confidence
    })
    .slice(0, 8) // Top 8 suggestions

  // Generate summary
  const highPriorityCount = prioritizedSuggestions.filter((s) => s.priority === "high").length
  const categories = [...new Set(prioritizedSuggestions.map((s) => s.category))]

  const summary = {
    totalIssues: prioritizedSuggestions.length,
    highPriorityCount,
    estimatedImpact:
      highPriorityCount > 3
        ? "High - Significant improvement potential"
        : highPriorityCount > 1
          ? "Medium - Moderate improvement expected"
          : "Low - Minor improvements possible",
    keyFocusAreas: categories.slice(0, 3),
  }

  return {
    suggestions: prioritizedSuggestions,
    summary,
  }
}

export function generateImplementationRoadmap(suggestions: AISuggestion[]): {
  phases: Array<{
    phase: number
    title: string
    duration: string
    suggestions: AISuggestion[]
    expectedOutcome: string
  }>
} {
  const highPriority = suggestions.filter((s) => s.priority === "high")
  const mediumPriority = suggestions.filter((s) => s.priority === "medium")
  const lowPriority = suggestions.filter((s) => s.priority === "low")

  const phases = []

  if (highPriority.length > 0) {
    phases.push({
      phase: 1,
      title: "Critical Issues Resolution",
      duration: "Weeks 1-8",
      suggestions: highPriority,
      expectedOutcome: "Address most impactful customer pain points",
    })
  }

  if (mediumPriority.length > 0) {
    phases.push({
      phase: phases.length + 1,
      title: "Process Optimization",
      duration: "Weeks 6-16",
      suggestions: mediumPriority,
      expectedOutcome: "Improve operational efficiency and customer experience",
    })
  }

  if (lowPriority.length > 0) {
    phases.push({
      phase: phases.length + 1,
      title: "Enhancement & Innovation",
      duration: "Weeks 12-24",
      suggestions: lowPriority,
      expectedOutcome: "Fine-tune experience and add value-added features",
    })
  }

  return { phases }
}
