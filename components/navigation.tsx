"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Navigation() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-foreground">
            ReviewAI
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Sign In</Link>
            </Button>
            <Button className="glow-primary" asChild>
              <Link href="/dashboard">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
