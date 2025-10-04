import { Card } from "@/components/ui/card"
import { Search, Zap, BookOpen, TrendingUp, Filter, Download } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Search,
      title: "Advanced Search",
      description:
        "Powerful semantic search across millions of papers with filters for domain, year, citations, and more.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get instant results with our optimized search engine built for speed and accuracy.",
    },
    {
      icon: Filter,
      title: "Smart Filters",
      description:
        "Filter by conference, journal, author, institution, and impact factor to find exactly what you need.",
    },
    {
      icon: Download,
      title: "PDF Access",
      description: "Direct access to full-text PDFs and preprints from arXiv and other repositories.",
    },
  ]

  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-4xl font-bold text-foreground md:text-5xl">
            Everything You Need for Research
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Powerful tools designed for researchers, students, and AI practitioners
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group border-border bg-card p-6 transition-all hover:border-primary/50 hover:bg-card/80"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
