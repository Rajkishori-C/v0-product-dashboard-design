import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="hero-gradient min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('/abstract-data-network.png')] opacity-5 bg-center bg-cover" />

      <div className="container mx-auto px-6 py-20 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-accent/50 text-accent-foreground px-4 py-2 rounded-full text-sm mb-8 border border-border">
            <Sparkles className="w-4 h-4" />
            AI-Powered Review Analysis
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent">
            Transform customer reviews into actionable insights
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 text-pretty max-w-3xl mx-auto leading-relaxed">
            ReviewAI analyzes your customer feedback and provides AI-powered suggestions to improve your product and
            customer satisfaction.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8 py-6 glow-primary" asChild>
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent" asChild>
              <Link href="/dashboard">Start Free Trial</Link>
            </Button>
          </div>

          <div className="mt-16 text-sm text-muted-foreground">Trusted by AI teams at</div>
          <div className="flex flex-wrap justify-center items-center gap-8 mt-6 opacity-60">
            <div className="text-lg font-semibold">TechCorp</div>
            <div className="text-lg font-semibold">DataFlow</div>
            <div className="text-lg font-semibold">InnovateLab</div>
            <div className="text-lg font-semibold">CloudSync</div>
            <div className="text-lg font-semibold">NextGen</div>
          </div>
        </div>
      </div>
    </section>
  )
}
