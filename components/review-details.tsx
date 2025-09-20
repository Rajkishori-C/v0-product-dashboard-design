"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Star, Calendar, MessageSquare } from "lucide-react"
import type { ReviewData } from "@/lib/excel-processor"
import { analyzeSentimentAdvanced } from "@/lib/advanced-sentiment"

interface ReviewDetailsProps {
  reviews: ReviewData[]
  selectedWord?: string
}

export function ReviewDetails({ reviews, selectedWord }: ReviewDetailsProps) {
  const [searchTerm, setSearchTerm] = useState(selectedWord || "")
  const [sentimentFilter, setSentimentFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("date")
  const [currentPage, setCurrentPage] = useState(1)
  const reviewsPerPage = 10

  // Filter and sort reviews
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = searchTerm === "" || review.review.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    if (sentimentFilter === "all") return true

    const sentiment = analyzeSentimentAdvanced(review.review).sentiment
    return sentiment === sentimentFilter
  })

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return (b.rating || 0) - (a.rating || 0)
      case "sentiment":
        const sentimentA = analyzeSentimentAdvanced(a.review).score
        const sentimentB = analyzeSentimentAdvanced(b.review).score
        return sentimentB - sentimentA
      case "length":
        return b.review.length - a.review.length
      default:
        return 0 // Keep original order for date
    }
  })

  // Pagination
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage)
  const startIndex = (currentPage - 1) * reviewsPerPage
  const paginatedReviews = sortedReviews.slice(startIndex, startIndex + reviewsPerPage)

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-500/20 text-green-400"
      case "negative":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-blue-500/20 text-blue-400"
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-500 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <Card className="glow-card border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Review Details
        </CardTitle>
        <CardDescription>
          {selectedWord ? `Reviews containing "${selectedWord}"` : "Detailed review analysis and filtering"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by sentiment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sentiments</SelectItem>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="sentiment">Sentiment</SelectItem>
              <SelectItem value="length">Length</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results summary */}
        <div className="text-sm text-muted-foreground">
          Showing {paginatedReviews.length} of {filteredReviews.length} reviews
        </div>

        {/* Reviews list */}
        <div className="space-y-4">
          {paginatedReviews.map((review) => {
            const sentimentResult = analyzeSentimentAdvanced(review.review)
            return (
              <div key={review.id} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={getSentimentColor(sentimentResult.sentiment)}>
                      {sentimentResult.sentiment}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(sentimentResult.confidence * 100)}% confidence
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {review.rating && (
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-muted-foreground ml-1">{review.rating}</span>
                      </div>
                    )}
                    {review.date && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {review.date}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm leading-relaxed">{review.review}</p>
                {review.category && (
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      {review.category}
                    </Badge>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
