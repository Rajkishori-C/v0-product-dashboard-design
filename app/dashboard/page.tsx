"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardStats } from "@/components/dashboard-stats"
import { SentimentChart } from "@/components/sentiment-chart"
import { WordCloud } from "@/components/word-cloud"
import { AISuggestions } from "@/components/ai-suggestions"
import { ReviewDetails } from "@/components/review-details"
import { UploadModal } from "@/components/upload-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileSpreadsheet, Loader2, Users, Star } from "lucide-react"
import { processExcelFile, type ProcessedData } from "@/lib/excel-processor"
import { generateAISuggestions } from "@/lib/ai-suggestions"
import { useToast } from "@/hooks/use-toast"
import { AdvancedAnalytics } from "@/components/advanced-analytics"
import { extractAdvancedKeywords } from "@/lib/keyword-extractor"

// Sample data for demonstration
const sampleStats = {
  totalReviews: 1247,
  positiveReviews: 856,
  negativeReviews: 234,
  neutralReviews: 157,
  averageRating: 4.2,
}

const sampleChartData = [
  { category: "Service", positive: 45, negative: 12, neutral: 8 },
  { category: "Product", positive: 38, negative: 18, neutral: 6 },
  { category: "Delivery", positive: 32, negative: 15, neutral: 9 },
  { category: "Support", positive: 28, negative: 8, neutral: 4 },
  { category: "Price", positive: 25, negative: 22, neutral: 7 },
]

const sampleWords = [
  { text: "excellent", count: 89, sentiment: "positive" as const },
  { text: "slow", count: 67, sentiment: "negative" as const },
  { text: "quality", count: 54, sentiment: "positive" as const },
  { text: "expensive", count: 43, sentiment: "negative" as const },
  { text: "helpful", count: 38, sentiment: "positive" as const },
  { text: "delayed", count: 32, sentiment: "negative" as const },
  { text: "satisfied", count: 29, sentiment: "positive" as const },
  { text: "recommend", count: 25, sentiment: "positive" as const },
]

const sampleEnhancedData = {
  keywords: [
    {
      text: "excellent service",
      count: 45,
      sentiment: "positive" as const,
      tfidf: 0.234,
      contexts: ["Excellent service from start to finish..."],
      categories: ["Customer Service"],
    },
    {
      text: "slow delivery",
      count: 32,
      sentiment: "negative" as const,
      tfidf: 0.198,
      contexts: ["Slow delivery took over a week..."],
      categories: ["Delivery & Shipping"],
    },
    {
      text: "great quality",
      count: 28,
      sentiment: "positive" as const,
      tfidf: 0.187,
      contexts: ["Great quality materials used..."],
      categories: ["Product Quality"],
    },
    {
      text: "expensive price",
      count: 24,
      sentiment: "negative" as const,
      tfidf: 0.156,
      contexts: ["Expensive price for what you get..."],
      categories: ["Pricing & Value"],
    },
    {
      text: "easy to use",
      count: 21,
      sentiment: "positive" as const,
      tfidf: 0.143,
      contexts: ["Easy to use interface..."],
      categories: ["User Experience"],
    },
  ],
  categoryKeywords: {
    "Customer Service": {
      positive: [
        {
          text: "excellent service",
          count: 45,
          sentiment: "positive" as const,
          tfidf: 0.234,
          contexts: [],
          categories: ["Customer Service"],
        },
      ],
      negative: [
        {
          text: "rude staff",
          count: 12,
          sentiment: "negative" as const,
          tfidf: 0.089,
          contexts: [],
          categories: ["Customer Service"],
        },
      ],
      neutral: [],
    },
    "Product Quality": {
      positive: [
        {
          text: "great quality",
          count: 28,
          sentiment: "positive" as const,
          tfidf: 0.187,
          contexts: [],
          categories: ["Product Quality"],
        },
      ],
      negative: [
        {
          text: "poor quality",
          count: 15,
          sentiment: "negative" as const,
          tfidf: 0.098,
          contexts: [],
          categories: ["Product Quality"],
        },
      ],
      neutral: [],
    },
  },
}

const sampleSuggestions = {
  suggestions: [
    {
      id: "suggestion-1",
      category: "Delivery",
      issue: "Multiple complaints about slow delivery times",
      suggestion: "Consider partnering with faster shipping providers or offering expedited shipping options",
      priority: "high" as const,
      impact: "Could improve customer satisfaction by 15-20%",
      actionItems: [
        "Partner with faster shipping providers",
        "Implement real-time tracking notifications",
        "Offer expedited shipping options",
      ],
      timeframe: "2-4 weeks",
      metrics: ["Average delivery time", "On-time delivery rate"],
      confidence: 0.85,
    },
    {
      id: "suggestion-2",
      category: "Pricing",
      issue: "Customers find products expensive compared to competitors",
      suggestion: "Introduce value bundles or loyalty discounts to improve perceived value",
      priority: "medium" as const,
      impact: "May increase customer retention by 10-15%",
      actionItems: ["Create value comparison charts", "Introduce tiered pricing options", "Offer loyalty discounts"],
      timeframe: "1-3 weeks",
      metrics: ["Price objection rate", "Conversion rate"],
      confidence: 0.72,
    },
  ],
  summary: {
    totalIssues: 2,
    highPriorityCount: 1,
    estimatedImpact: "Medium - Moderate improvement expected",
    keyFocusAreas: ["Delivery", "Pricing"],
  },
}

export default function DashboardPage() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [hasData, setHasData] = useState(true) // Set to true to show sample data
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null)
  const [selectedWord, setSelectedWord] = useState<string>("")
  const [showReviewDetails, setShowReviewDetails] = useState(false)
  const { toast } = useToast()

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true)
    try {
      console.log("[v0] Starting file processing...")
      const data = await processExcelFile(file)
      console.log("[v0] File processed, generating suggestions...")
      const suggestions = generateAISuggestions(data)
      const enhancedKeywords = extractAdvancedKeywords(data.reviews)

      setProcessedData({ ...data, enhancedKeywords })
      setHasData(true)

      toast({
        title: "Amazon Reviews Processed Successfully!",
        description: `Analyzed ${data.stats.totalReviews} reviews, extracted ${data.enhancedKeywords.length} keywords, and generated ${suggestions.suggestions.length} AI suggestions.`,
      })

      console.log("[v0] Processing complete:", {
        totalReviews: data.stats.totalReviews,
        keywordsExtracted: data.enhancedKeywords.length,
        suggestionsGenerated: suggestions.suggestions.length,
      })
    } catch (error) {
      console.log("[v0] Error processing file:", error)
      toast({
        title: "Error processing Excel file",
        description:
          error instanceof Error
            ? error.message
            : "Please ensure your Excel file has the correct Amazon reviews format.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleWordClick = (word: string) => {
    setSelectedWord(word)
    setShowReviewDetails(true)
    toast({
      title: "Keyword Analysis",
      description: `Showing reviews containing "${word}" with sentiment analysis.`,
    })
  }

  const currentStats = processedData?.stats || sampleStats
  const currentChartData = processedData?.chartData || sampleChartData
  const currentWords = processedData?.words || sampleWords
  const currentSuggestions = processedData ? generateAISuggestions(processedData) : sampleSuggestions

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onUploadClick={() => setUploadModalOpen(true)} hasData={hasData} />

      <div className="container mx-auto px-6 py-8">
        {hasData ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Amazon Review Analytics Dashboard</h1>
                <p className="text-muted-foreground">
                  {processedData
                    ? "AI-powered insights from your uploaded Amazon reviews data"
                    : "AI-powered insights from sample Amazon reviews data"}
                </p>
              </div>
              {processedData && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{processedData.reviews.length} reviews</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>{currentStats.averageRating.toFixed(1)} avg rating</span>
                  </div>
                </div>
              )}
            </div>

            <DashboardStats stats={currentStats} />

            {processedData && (
              <Card className="glow-card border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-primary" />
                    Data Processing Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Keywords Extracted</p>
                      <p className="font-semibold text-lg">{processedData.enhancedKeywords.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Positive Sentiment</p>
                      <p className="font-semibold text-lg text-green-500">
                        {Math.round((currentStats.positiveReviews / currentStats.totalReviews) * 100)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Negative Sentiment</p>
                      <p className="font-semibold text-lg text-red-500">
                        {Math.round((currentStats.negativeReviews / currentStats.totalReviews) * 100)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Neutral Sentiment</p>
                      <p className="font-semibold text-lg text-purple-500">
                        {Math.round((currentStats.neutralReviews / currentStats.totalReviews) * 100)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
              <SentimentChart data={currentChartData} />
              <WordCloud words={currentWords} onWordClick={handleWordClick} />
            </div>

            <AdvancedAnalytics
              keywords={processedData?.enhancedKeywords || sampleEnhancedData.keywords}
              categoryKeywords={processedData?.categoryKeywords || sampleEnhancedData.categoryKeywords}
              stats={currentStats}
            />

            <AISuggestions analysis={currentSuggestions} />

            {showReviewDetails && processedData && (
              <ReviewDetails reviews={processedData.reviews} selectedWord={selectedWord} />
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="glow-card border-border/50 bg-card/50 backdrop-blur-sm max-w-md w-full">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  {isProcessing ? (
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  ) : (
                    <FileSpreadsheet className="w-8 h-8 text-primary" />
                  )}
                </div>
                <CardTitle>{isProcessing ? "Processing Amazon Reviews..." : "No Data Available"}</CardTitle>
                <CardDescription>
                  {isProcessing
                    ? "Extracting keywords and analyzing sentiment from your review data"
                    : "Upload your Amazon reviews Excel file to start analyzing customer feedback"}
                </CardDescription>
              </CardHeader>
              {!isProcessing && (
                <CardContent className="text-center">
                  <button
                    onClick={() => setUploadModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors glow-primary"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Amazon Reviews
                  </button>
                </CardContent>
              )}
            </Card>
          </div>
        )}
      </div>

      <UploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} onFileUpload={handleFileUpload} />
    </div>
  )
}
