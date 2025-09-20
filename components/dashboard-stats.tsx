import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, MessageSquare, Star } from "lucide-react"

interface DashboardStatsProps {
  stats: {
    totalReviews: number
    positiveReviews: number
    negativeReviews: number
    neutralReviews: number
    averageRating: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const positivePercentage = Math.round((stats.positiveReviews / stats.totalReviews) * 100)
  const negativePercentage = Math.round((stats.negativeReviews / stats.totalReviews) * 100)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="glow-card border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalReviews.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Reviews analyzed</p>
        </CardContent>
      </Card>

      <Card className="glow-card border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Positive Sentiment</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">{positivePercentage}%</div>
          <p className="text-xs text-muted-foreground">{stats.positiveReviews} positive reviews</p>
        </CardContent>
      </Card>

      <Card className="glow-card border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Negative Sentiment</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">{negativePercentage}%</div>
          <p className="text-xs text-muted-foreground">{stats.negativeReviews} negative reviews</p>
        </CardContent>
      </Card>

      <Card className="glow-card border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          <Star className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-500">{stats.averageRating.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">Out of 5 stars</p>
        </CardContent>
      </Card>
    </div>
  )
}
