"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface WordCloudProps {
  words: Array<{
    text: string
    count: number
    sentiment: "positive" | "negative" | "neutral"
  }>
  onWordClick: (word: string) => void
}

export function WordCloud({ words, onWordClick }: WordCloudProps) {
  const maxCount = Math.max(...words.map((w) => w.count))

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-500/20 text-green-400 hover:bg-green-500/30"
      case "negative":
        return "bg-red-500/20 text-red-400 hover:bg-red-500/30"
      default:
        return "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
    }
  }

  const getFontSize = (count: number) => {
    const ratio = count / maxCount
    return Math.max(0.8, ratio * 2) + "rem"
  }

  return (
    <Card className="glow-card border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Key Terms</CardTitle>
        <CardDescription>Most frequently mentioned words in reviews (click to explore)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {words.map((word, index) => (
            <Badge
              key={index}
              variant="secondary"
              className={`cursor-pointer transition-all duration-200 ${getSentimentColor(word.sentiment)}`}
              style={{ fontSize: getFontSize(word.count) }}
              onClick={() => onWordClick(word.text)}
            >
              {word.text} ({word.count})
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
