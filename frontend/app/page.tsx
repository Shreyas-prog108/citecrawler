import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { DomainGrid } from "@/components/domain-grid"
import { Stats } from "@/components/stats"
import { CTA } from "@/components/cta"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Stats />
        <Features />
        <DomainGrid />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
