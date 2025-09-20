import * as XLSX from "xlsx"
import { analyzeSentimentAdvanced } from "./advanced-sentiment"
import { extractAdvancedKeywords } from "./keyword-extractor"

export interface ReviewData {
  id: string
  review: string
  rating?: number
  category?: string
  date?: string
  sentiment?: "positive" | "negative" | "neutral"
  confidence?: number
}

export interface ProcessedData {
  reviews: ReviewData[]
  stats: {
    totalReviews: number
    positiveReviews: number
    negativeReviews: number
    neutralReviews: number
    averageRating: number
  }
  chartData: Array<{
    category: string
    positive: number
    negative: number
    neutral: number
  }>
  words: Array<{
    text: string
    count: number
    sentiment: "positive" | "negative" | "neutral"
  }>
  enhancedKeywords: Array<{
    text: string
    count: number
    sentiment: "positive" | "negative" | "neutral"
    confidence: number
  }>
  categoryKeywords: Record<
    string,
    Array<{ text: string; count: number; sentiment: "positive" | "negative" | "neutral" }>
  >
}

// Simple sentiment analysis based on keywords
const positiveWords = [
  "excellent",
  "great",
  "amazing",
  "wonderful",
  "fantastic",
  "perfect",
  "love",
  "best",
  "awesome",
  "outstanding",
  "satisfied",
  "happy",
  "good",
  "recommend",
  "quality",
  "helpful",
  "fast",
  "easy",
]

const negativeWords = [
  "terrible",
  "awful",
  "bad",
  "worst",
  "hate",
  "horrible",
  "disappointing",
  "poor",
  "slow",
  "expensive",
  "delayed",
  "broken",
  "defective",
  "useless",
  "frustrated",
  "angry",
  "problem",
  "issue",
]

function analyzeSentiment(text: string): "positive" | "negative" | "neutral" {
  return analyzeSentimentAdvanced(text).sentiment
}

function extractKeywords(
  reviews: ReviewData[],
): Array<{ text: string; count: number; sentiment: "positive" | "negative" | "neutral" }> {
  const wordCount: Record<string, { count: number; sentiments: string[] }> = {}

  const stopWords = new Set([
    "the",
    "and",
    "for",
    "are",
    "but",
    "not",
    "you",
    "all",
    "can",
    "had",
    "her",
    "was",
    "one",
    "our",
    "out",
    "day",
    "get",
    "has",
    "him",
    "his",
    "how",
    "man",
    "new",
    "now",
    "old",
    "see",
    "two",
    "way",
    "who",
    "boy",
    "did",
    "its",
    "let",
    "put",
    "say",
    "she",
    "too",
    "use",
  ])

  reviews.forEach((review) => {
    const words = review.review
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 3 && !stopWords.has(word))

    const sentimentResult = analyzeSentimentAdvanced(review.review)

    words.forEach((word) => {
      if (!wordCount[word]) {
        wordCount[word] = { count: 0, sentiments: [] }
      }
      wordCount[word].count++
      wordCount[word].sentiments.push(sentimentResult.sentiment)
    })
  })

  return Object.entries(wordCount)
    .map(([word, data]) => {
      // Determine overall sentiment for this word
      const sentimentCounts = data.sentiments.reduce(
        (acc, s) => {
          acc[s]++
          return acc
        },
        { positive: 0, negative: 0, neutral: 0 } as Record<string, number>,
      )

      const dominantSentiment = Object.entries(sentimentCounts).reduce((a, b) =>
        sentimentCounts[a[0]] > sentimentCounts[b[0]] ? a : b,
      )[0] as "positive" | "negative" | "neutral"

      return {
        text: word,
        count: data.count,
        sentiment: dominantSentiment,
      }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 25) // Increased to top 25 keywords
}

function categorizeReviews(
  reviews: ReviewData[],
): Array<{ category: string; positive: number; negative: number; neutral: number }> {
  const categories = ["Service", "Product", "Delivery", "Support", "Price"]
  const categoryKeywords = {
    Service: ["service", "staff", "help", "support", "customer", "representative", "team", "experience"],
    Product: ["product", "item", "quality", "material", "design", "feature", "functionality", "performance"],
    Delivery: ["delivery", "shipping", "arrived", "package", "fast", "slow", "transport", "logistics"],
    Support: ["support", "help", "assistance", "response", "solution", "technical", "customer service"],
    Price: ["price", "cost", "expensive", "cheap", "value", "money", "affordable", "budget"],
  }

  return categories.map((category) => {
    const categoryReviews = reviews.filter((review) =>
      categoryKeywords[category as keyof typeof categoryKeywords].some((keyword) =>
        review.review.toLowerCase().includes(keyword),
      ),
    )

    const sentiments = categoryReviews.reduce(
      (acc, review) => {
        const sentiment = analyzeSentimentAdvanced(review.review).sentiment
        acc[sentiment]++
        return acc
      },
      { positive: 0, negative: 0, neutral: 0 },
    )

    return {
      category,
      ...sentiments,
    }
  })
}

export async function processExcelFile(file: File): Promise<ProcessedData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        // Convert to ReviewData format
        const reviews: ReviewData[] = jsonData.map((row: any, index) => ({
          id: `review-${index}`,
          review: row.review || row.Review || row.comment || row.Comment || row.feedback || row.Feedback || "",
          rating: row.rating || row.Rating || row.score || row.Score || undefined,
          category: row.category || row.Category || undefined,
          date: row.date || row.Date || undefined,
        }))

        // Filter out empty reviews
        const validReviews = reviews.filter((review) => review.review.trim().length > 0)

        const reviewsWithSentiment = validReviews.map((review) => {
          const sentimentResult = analyzeSentimentAdvanced(review.review)
          return {
            ...review,
            sentiment: sentimentResult.sentiment,
            confidence: sentimentResult.confidence,
          }
        })

        const positiveCount = reviewsWithSentiment.filter((r) => r.sentiment === "positive").length
        const negativeCount = reviewsWithSentiment.filter((r) => r.sentiment === "negative").length
        const neutralCount = reviewsWithSentiment.filter((r) => r.sentiment === "neutral").length

        const ratings = validReviews.filter((r) => r.rating).map((r) => r.rating!)
        const averageRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0

        const stats = {
          totalReviews: validReviews.length,
          positiveReviews: positiveCount,
          negativeReviews: negativeCount,
          neutralReviews: neutralCount,
          averageRating,
        }

        // Generate enhanced analytics
        const chartData = categorizeReviews(validReviews)
        const { keywords, categoryKeywords } = extractAdvancedKeywords(reviewsWithSentiment)

        // Convert to legacy format for compatibility
        const words = keywords.slice(0, 25).map((k) => ({
          text: k.text,
          count: k.count,
          sentiment: k.sentiment,
        }))

        resolve({
          reviews: validReviews,
          stats,
          chartData,
          words,
          // Add new enhanced data
          enhancedKeywords: keywords,
          categoryKeywords,
        })
      } catch (error) {
        reject(new Error("Failed to process Excel file. Please ensure it contains review data."))
      }
    }

    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsArrayBuffer(file)
  })
}
