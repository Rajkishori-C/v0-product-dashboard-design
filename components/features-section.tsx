import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, BarChart3, Upload, Zap } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description:
        "Advanced natural language processing to understand sentiment and extract key insights from customer reviews.",
    },
    {
      icon: BarChart3,
      title: "Interactive Visualizations",
      description: "Dynamic charts and word clouds that let you explore your data and discover patterns at a glance.",
    },
    {
      icon: Upload,
      title: "Easy Data Import",
      description: "Upload Excel files directly in your browser. No complex setup or backend configuration required.",
    },
    {
      icon: Zap,
      title: "Actionable Suggestions",
      description:
        "Get specific, AI-generated recommendations to address negative feedback and improve customer satisfaction.",
    },
  ]

  return (
    <section id="features" className="py-24 bg-card/30 relative">
      <div
        className="container mx-auto px-6 relative z-10"
        style={{
          backgroundImage: "url(/employees-feedback-discussion.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] rounded-lg"></div>

        <div className="relative z-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance text-white drop-shadow-lg">
              Powerful features for <span className="text-primary">smarter insights</span>
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto text-pretty drop-shadow-md">
              Everything you need to transform raw customer feedback into strategic business decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="glow-card border-border/50 bg-card/90 backdrop-blur-md hover:bg-card/95 transition-all duration-300 shadow-xl"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
