import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-32">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-invert prose-violet">
          <p>Last updated: January 1, 2025</p>
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using WriteFlow AI, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.</p>
          <h2>2. Subscriptions</h2>
          <p>Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis.</p>
          <h2>3. Content Ownership</h2>
          <p>You retain full ownership of any content you generate using our AI tools. We do not claim copyright over AI-generated outputs.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
