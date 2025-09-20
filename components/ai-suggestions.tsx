"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Progress } from "@/components/ui/progress"
import { Lightbulb, AlertTriangle, TrendingUp, ChevronDown, ChevronRight, Target, Clock, BarChart3 } from "lucide-react"
import { useState } from "react"
import type { SuggestionAnalysis } from "@/lib/ai-suggestions"
import { generateImplementationRoadmap } from "@/lib/ai-suggestions"

interface AISuggestionsProps {
  analysis: SuggestionAnalysis
}

export function AISuggestions({ analysis }: AISuggestionsProps) {
  const [expandedSuggestions, setExpandedSuggestions] = useState<Set<string>>(new Set())
  const [showRoadmap, setShowRoadmap] = useState(false)

  const toggleSuggestion = (id: string) => {
    const newExpanded = new Set(expandedSuggestions)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedSuggestions(newExpanded)
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "medium":
        return <TrendingUp className="w-4 h-4 text-yellow-500" />
      default:
        return <Lightbulb className="w-4 h-4 text-blue-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    }
  }

  const roadmap = generateImplementationRoadmap(analysis.suggestions)

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="glow-card border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            AI Analysis Summary
          </CardTitle>
          <CardDescription>Key insights and improvement opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{analysis.summary.totalIssues}</div>
              <div className="text-sm text-muted-foreground">Issues Identified</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{analysis.summary.highPriorityCount}</div>
              <div className="text-sm text-muted-foreground">High Priority</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-foreground">{analysis.summary.estimatedImpact}</div>
              <div className="text-sm text-muted-foreground">Improvement Potential</div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Key Focus Areas:</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.summary.keyFocusAreas.map((area, index) => (
                <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                  {area}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowRoadmap(!showRoadmap)} className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {showRoadmap ? "Hide" : "View"} Implementation Roadmap
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Roadmap */}
      {showRoadmap && (
        <Card className="glow-card border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Implementation Roadmap
            </CardTitle>
            <CardDescription>Phased approach to implementing improvements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {roadmap.phases.map((phase, index) => (
                <div key={phase.phase} className="relative">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-bold text-primary">
                      {phase.phase}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{phase.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{phase.duration}</p>
                      <p className="text-sm mb-3">{phase.expectedOutcome}</p>
                      <div className="text-xs text-muted-foreground">
                        {phase.suggestions.length} suggestion{phase.suggestions.length !== 1 ? "s" : ""} in this phase
                      </div>
                    </div>
                  </div>
                  {index < roadmap.phases.length - 1 && <div className="absolute left-4 top-8 w-0.5 h-6 bg-border" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Suggestions */}
      <Card className="glow-card border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Detailed AI Suggestions
          </CardTitle>
          <CardDescription>Actionable recommendations with implementation details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {analysis.suggestions.map((suggestion) => (
            <Collapsible key={suggestion.id}>
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <CollapsibleTrigger className="w-full text-left" onClick={() => toggleSuggestion(suggestion.id)}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(suggestion.priority)}
                      <span className="font-medium text-sm">{suggestion.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={getPriorityColor(suggestion.priority)}>
                        {suggestion.priority} priority
                      </Badge>
                      {expandedSuggestions.has(suggestion.id) ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <div className="mb-2">
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>Issue:</strong> {suggestion.issue}
                    </p>
                  </div>
                  <div className="mb-2">
                    <p className="text-sm">
                      <strong>Suggestion:</strong> {suggestion.suggestion}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      <strong>Expected Impact:</strong> {suggestion.impact}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Confidence:</span>
                      <Progress value={suggestion.confidence * 100} className="w-16 h-2" />
                    </div>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="mt-4 pt-4 border-t border-border/50 space-y-4">
                    <div>
                      <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Action Items
                      </h5>
                      <ul className="text-sm space-y-1">
                        {suggestion.actionItems.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Timeframe
                        </h5>
                        <p className="text-sm text-muted-foreground">{suggestion.timeframe}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" />
                          Success Metrics
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {suggestion.metrics.map((metric, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {metric}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
