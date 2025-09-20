"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface SentimentChartProps {
  data: Array<{
    category: string
    positive: number
    negative: number
    neutral: number
  }>
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0)

    return (
      <div className="bg-background/95 backdrop-blur-md border border-border/50 rounded-lg p-4 shadow-2xl min-w-[200px]">
        <p className="font-semibold text-foreground mb-2 text-center">{label}</p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => {
            const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(1) : "0"
            const color = entry.color

            return (
              <div key={index} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: color }} />
                  <span className="text-sm font-medium text-foreground">{entry.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-foreground">{entry.value}</div>
                  <div className="text-xs text-muted-foreground">{percentage}%</div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-3 pt-2 border-t border-border/30">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Total Reviews:</span>
            <span className="font-semibold">{total}</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

const gradientColors = {
  positive: ["#10b981", "#34d399"], // Green gradient
  negative: ["#ef4444", "#f87171"], // Red gradient
  neutral: ["#6366f1", "#8b5cf6"], // Purple gradient
}

export function SentimentChart({ data }: SentimentChartProps) {
  return (
    <Card className="glow-card border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Sentiment by Category</CardTitle>
        <CardDescription>Review sentiment breakdown across different categories</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barCategoryGap="20%">
            <defs>
              <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={gradientColors.positive[0]} />
                <stop offset="100%" stopColor={gradientColors.positive[1]} />
              </linearGradient>
              <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={gradientColors.negative[0]} />
                <stop offset="100%" stopColor={gradientColors.negative[1]} />
              </linearGradient>
              <linearGradient id="neutralGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={gradientColors.neutral[0]} />
                <stop offset="100%" stopColor={gradientColors.neutral[1]} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />

            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255, 255, 255, 0.1)" }} />

            <Bar
              dataKey="positive"
              fill="url(#positiveGradient)"
              name="Positive"
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
            />
            <Bar
              dataKey="negative"
              fill="url(#negativeGradient)"
              name="Negative"
              radius={[4, 4, 0, 0]}
              animationDuration={1200}
            />
            <Bar
              dataKey="neutral"
              fill="url(#neutralGradient)"
              name="Neutral"
              radius={[4, 4, 0, 0]}
              animationDuration={1400}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
