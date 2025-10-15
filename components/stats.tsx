export function Stats() {
  const stats = [
    { value: "10K+", label: "Research Papers" },
    { value: "40+", label: "AI/ML Domains" },
    { value: "500+", label: "Active Researchers" },
    { value: "99.9%", label: "Uptime" },
  ]

  return (
    <section className="border-y border-border/40 bg-card/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary md:text-5xl">{stat.value}</div>
              <div className="text-sm text-muted-foreground md:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
