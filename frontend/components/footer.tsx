import { Search } from "lucide-react"

export function Footer() {
  const links = {
    Product: ["Features", "Domains", "Pricing", "API"],
    Resources: ["Documentation", "Guides", "Blog", "Support"],
    Company: ["About", "Careers", "Contact", "Privacy"],
  }

  return (
    <footer className="border-t border-border bg-card/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Search className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">CiteCrawler</span>
            </div>
            <p className="text-sm text-muted-foreground">
              The most comprehensive research paper search engine for AI, ML, and Data Science.
            </p>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="mb-4 font-semibold text-foreground">{category}</h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 CiteCrawler. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
