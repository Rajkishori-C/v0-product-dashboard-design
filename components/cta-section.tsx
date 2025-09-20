import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-24 bg-card/30">
      <div className="container mx-auto px-6">
        <Card className="glow-card border-border/50 bg-card/50 backdrop-blur-sm max-w-4xl mx-auto">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Ready to unlock your <span className="text-primary">customer insights</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              Join thousands of businesses using ReviewAI to make data-driven decisions and improve customer
              satisfaction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 glow-primary" asChild>
                <Link href="/dashboard">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent" asChild>
                <Link href="/dashboard">View Dashboard Demo</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
