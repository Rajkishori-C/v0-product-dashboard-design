import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Brain, Target } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      icon: Upload,
      step: "01",
      title: "Upload Your Data",
      description:
        "Simply drag and drop your Excel file containing customer reviews. Our system processes it instantly in your browser.",
    },
    {
      icon: Brain,
      step: "02",
      title: "AI Analysis",
      description:
        "Our advanced AI analyzes sentiment, categorizes feedback, and identifies key themes and patterns in your reviews.",
    },
    {
      icon: Target,
      step: "03",
      title: "Get Actionable Insights",
      description:
        "Receive specific, AI-generated suggestions to address issues and improve customer satisfaction based on your data.",
    },
  ]

  return (
    <section id="how-it-works" className="py-24">
      <div
        className="container mx-auto px-6 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/laptop-insights-background.jpg)" }}
      >
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>

        {/* Content wrapper with relative positioning */}
        <div className="relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance text-white drop-shadow-lg">
              How it <span className="text-primary">works</span>
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto text-pretty drop-shadow-md">
              Three simple steps to transform your customer feedback into strategic insights.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => {
              const gradientClasses = [
                "bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-400/30",
                "bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-purple-400/30",
                "bg-gradient-to-br from-pink-500/20 to-orange-600/20 border-pink-400/30",
              ]

              return (
                <div key={index} className="relative">
                  <Card className={`glow-card ${gradientClasses[index]} backdrop-blur-md h-full shadow-xl`}>
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <step.icon className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-sm font-mono text-primary mb-2">{step.step}</div>
                      <CardTitle className="text-xl text-white">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <CardDescription className="text-white/90 leading-relaxed">{step.description}</CardDescription>
                    </CardContent>
                  </Card>

                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border transform -translate-y-1/2" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
