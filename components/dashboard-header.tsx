"use client"

import { Button } from "@/components/ui/button"
import { Upload, Home, BarChart3 } from "lucide-react"
import Link from "next/link"

interface DashboardHeaderProps {
  onUploadClick: () => void
  hasData: boolean
}

export function DashboardHeader({ onUploadClick, hasData }: DashboardHeaderProps) {
  return (
    <div className="border-b border-border bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-xl font-bold text-foreground">
              ReviewAI
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link href="/dashboard" className="flex items-center gap-2 text-foreground font-medium">
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Link>
            </nav>
          </div>

          <Button onClick={onUploadClick} className="glow-primary">
            <Upload className="w-4 h-4 mr-2" />
            {hasData ? "Upload New Data" : "Upload Data"}
          </Button>
        </div>
      </div>
    </div>
  )
}
