"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Sparkles } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { SigninDialog } from "@/components/signin-dialog"

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSignin, setShowSignin] = useState(false)
  const router = useRouter()

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Redirect to search results page with query
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleGetStarted = () => {
    setShowSignin(true)
  }

  const handleViewDemo = () => {
    // Scroll to features section
    const featuresSection = document.getElementById('features')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handlePopularSearch = (term: string) => {
    setSearchQuery(term)
  }

  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              <span>40+ AI/ML Domains Covered</span>
            </div>

            <h1 className="mb-6 text-balance text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl">
              Discover Research Papers Across{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                AI & Data Science
              </span>
            </h1>

            <p className="mb-10 text-pretty text-lg text-muted-foreground md:text-xl">
              Search, explore, and cite cutting-edge research papers from machine learning, deep learning, NLP, computer
              vision, and 40+ specialized domains.
            </p>

            {/* Search bar */}
            <div className="mx-auto mb-8 max-w-2xl">
              <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for papers on neural networks, transformers, GANs..."
                    className="h-14 bg-card pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button 
                  size="lg" 
                  className="h-14 bg-primary px-8 text-primary-foreground hover:bg-primary/90"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
              <span>Popular searches:</span>
              {["Transformers", "GANs", "Reinforcement Learning", "Computer Vision"].map((term) => (
                <button
                  key={term}
                  className="rounded-full border border-border bg-card px-4 py-1.5 text-foreground transition-colors hover:border-primary hover:bg-primary/10"
                  onClick={() => handlePopularSearch(term)}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SigninDialog open={showSignin} onOpenChange={setShowSignin} />
    </>
  )
}