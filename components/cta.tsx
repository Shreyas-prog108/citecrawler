"use client";

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { SigninDialog } from "@/components/signin-dialog"
import { useAuth } from "@/hooks/use-auth"

export function CTA() {
  const [showSignin, setShowSignin] = useState(false)
  const router = useRouter()
  const { user, loading } = useAuth()

  const handleGetStarted = () => {
    if (loading) return
    if (user) {
      router.push("/home")
      return
    }
    setShowSignin(true)
  }



  const handleViewDemo = () => {
    // Scroll to features section
    const featuresSection = document.getElementById('features')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 p-12 md:p-16">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-10" />

            <div className="relative mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-balance text-4xl font-bold text-foreground md:text-5xl">
                Start Exploring Research Today
              </h2>
              <p className="mb-8 text-pretty text-lg text-muted-foreground">
                Join thousands of researchers and students using CiteCrawler to discover and cite cutting-edge AI and data
                science research.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleGetStarted}
                >
 


              
                {loading ? "Checking session..." : "Get Started"}
                <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border text-foreground hover:bg-card bg-transparent"
                  onClick={handleViewDemo}
                >
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SigninDialog open={showSignin} onOpenChange={setShowSignin} />
    </>
  )
}