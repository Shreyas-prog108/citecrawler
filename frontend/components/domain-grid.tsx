"use client";
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function DomainGrid() {
  const domains = [
    { name: "Natural Language Processing", color: "bg-chart-1" },
    { name: "Computer Vision", color: "bg-chart-2" },
    { name: "Reinforcement Learning", color: "bg-chart-3" },
    { name: "Deep Learning",  color: "bg-chart-1" },
    { name: "Machine Learning", color: "bg-chart-4" },
    { name: "Neural Networks",  color: "bg-chart-2" },
    { name: "Generative AI",  color: "bg-chart-5" },
    // { name: "Data Mining", papers: "2.1M+", color: "bg-chart-3" },
    // { name: "Time Series Analysis", papers: "980K+", color: "bg-chart-1" },
    // { name: "Robotics", papers: "1.5M+", color: "bg-chart-4" },
    // { name: "Speech Recognition", papers: "750K+", color: "bg-chart-2" },
    // { name: "Recommender Systems", papers: "620K+", color: "bg-chart-5" },
  ]

  return (
    <section id="domains" className="bg-card/30 py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-4xl font-bold text-foreground md:text-5xl">40+ Specialized Domains</h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Comprehensive coverage across all major areas of AI, ML, and Data Science
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {domains.map((domain, index) => (
            <Card
              key={index}
              className="group cursor-pointer border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className={`h-2 w-2 rounded-full ${domain.color}`} />

              </div>
              <h3 className="text-balance font-semibold text-foreground group-hover:text-primary">{domain.name}</h3>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button onClick={()=>window.location.href="#domains"}  className="text-primary hover:underline">40+ domains →</button>
        </div>
      </div>
    </section>
  )
}
