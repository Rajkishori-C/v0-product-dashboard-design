"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { KeywordData, CategoryKeywords } from "@/lib/keyword-extractor"

interface AdvancedAnalyticsProps {
  keywords: KeywordData[]
  categoryKeywords: CategoryKeywords
  stats: {
    totalReviews: number
    positiveReviews: number
    negativeReviews: number
    neutralReviews: number
    averageRating: number
  }
}

const COLORS = {
  positive: "#10b981",
  negative: "#ef4444",
  neutral: "#6b7280",
}

export function AdvancedAnalytics({ keywords, categoryKeywords, stats }: AdvancedAnalyticsProps) {
  // Prepare data for sentiment distribution pie chart
  const sentimentData = [
    { name: "Positive", value: stats.positiveReviews, color: COLORS.positive },
    { name: "Negative", value: stats.negativeReviews, color: COLORS.negative },
    { name: "Neutral", value: stats.neutralReviews, color: COLORS.neutral },
  ]

  // Prepare category analysis data
  const categoryAnalysis = Object.entries(categoryKeywords)
    .map(([category, data]) => ({
      category,
      positive: data.positive.length,
      negative: data.negative.length,
      neutral: data.neutral.length,
      total: data.positive.length + data.negative.length + data.neutral.length,
      sentiment_score:
        (data.positive.length - data.negative.length) /
        (data.positive.length + data.negative.length + data.neutral.length || 1),
    }))
    .filter((item) => item.total > 0)
    .sort((a, b) => b.total - a.total)

  // Top keywords by TF-IDF
  const topKeywords = keywords.slice(0, 15).map((k) => ({
    keyword: k.text,
    score: k.tfidf * k.count,
    count: k.count,
    sentiment: k.sentiment,
  }))

  // Keyword frequency distribution
  const keywordFreqData = keywords.slice(0, 10).map((k) => ({
    keyword: k.text.length > 15 ? k.text.substring(0, 15) + "..." : k.text,
    count: k.count,
    sentiment: k.sentiment,
  }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{keywords.length}</div>
            <p className="text-xs text-muted-foreground">Extracted from reviews</p>
          </CardContent>
        </Card>

        <Card className="glow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sentiment Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(((stats.positiveReviews - stats.negativeReviews) / stats.totalReviews) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Overall sentiment</p>
          </CardContent>
        </Card>

        <Card className="glow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(categoryKeywords).length}</div>
            <p className="text-xs text-muted-foreground">Analysis categories</p>
          </CardContent>
        </Card>

        <Card className="glow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Out of 5.0</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glow-card border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Sentiment Distribution</CardTitle>
                <CardDescription>Overall sentiment breakdown of reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [value, "Reviews"]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {sentimentData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">
                        {item.name}: {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glow-card border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Top Keywords by Relevance</CardTitle>
                <CardDescription>Keywords ranked by TF-IDF score and frequency</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topKeywords} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="keyword" type="category" width={80} />
                    <Tooltip formatter={(value: number) => [value.toFixed(3), "Relevance Score"]} />
                    <Bar dataKey="score" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glow-card border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Keyword Frequency</CardTitle>
                <CardDescription>Most mentioned keywords in reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={keywordFreqData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="keyword" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="count"
                      fill={(entry) => COLORS[entry?.sentiment as keyof typeof COLORS] || "#8b5cf6"}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glow-card border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Keyword Details</CardTitle>
                <CardDescription>Top keywords with context and sentiment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {keywords.slice(0, 10).map((keyword, index) => (
                  <div key={index} className="border-b border-border/50 pb-3 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{keyword.text}</span>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            keyword.sentiment === "positive"
                              ? "default"
                              : keyword.sentiment === "negative"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {keyword.sentiment}
                        </Badge>
                        <span className="text-sm text-muted-foreground">×{keyword.count}</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">Categories: {keyword.categories.join(", ")}</div>
                    <div className="text-xs text-muted-foreground mt-1">TF-IDF: {keyword.tfidf.toFixed(4)}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card className="glow-card border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Category Analysis</CardTitle>
              <CardDescription>Sentiment analysis by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={categoryAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="positive" stackId="a" fill={COLORS.positive} name="Positive" />
                  <Bar dataKey="neutral" stackId="a" fill={COLORS.neutral} name="Neutral" />
                  <Bar dataKey="negative" stackId="a" fill={COLORS.negative} name="Negative" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryAnalysis.slice(0, 6).map((category) => (
              <Card key={category.category} className="glow-card border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{category.category}</CardTitle>
                  <CardDescription>{category.total} keywords found</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Sentiment Score</span>
                    <span
                      className={
                        category.sentiment_score > 0
                          ? "text-green-500"
                          : category.sentiment_score < 0
                            ? "text-red-500"
                            : "text-gray-500"
                      }
                    >
                      {(category.sentiment_score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={Math.abs(category.sentiment_score) * 100} className="h-2" />
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-medium text-green-500">{category.positive}</div>
                      <div className="text-muted-foreground">Positive</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-500">{category.neutral}</div>
                      <div className="text-muted-foreground">Neutral</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-red-500">{category.negative}</div>
                      <div className="text-muted-foreground">Negative</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glow-card border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Positive Highlights
                </CardTitle>
                <CardDescription>Top positive keywords across categories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {keywords
                  .filter((k) => k.sentiment === "positive")
                  .slice(0, 8)
                  .map((keyword, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{keyword.text}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="text-xs">
                          ×{keyword.count}
                        </Badge>
                        <div className="text-xs text-muted-foreground">{keyword.categories[0]}</div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card className="glow-card border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-red-500" />
                  Areas for Improvement
                </CardTitle>
                <CardDescription>Top negative keywords requiring attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {keywords
                  .filter((k) => k.sentiment === "negative")
                  .slice(0, 8)
                  .map((keyword, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{keyword.text}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="text-xs">
                          ×{keyword.count}
                        </Badge>
                        <div className="text-xs text-muted-foreground">{keyword.categories[0]}</div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
