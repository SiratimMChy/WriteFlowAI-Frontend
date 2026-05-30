import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-32">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-invert prose-violet">
          <p>Last updated: January 1, 2025</p>
          <h2>1. Information we collect</h2>
          <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us.</p>
          <h2>2. How we use your information</h2>
          <p>We use the information we collect about you to provide, maintain, and improve our services, including to facilitate payments, send receipts, provide products and services you request.</p>
          <h2>3. AI Processing</h2>
          <p>The content you generate using WriteFlow AI is processed by third-party LLM providers. Please refer to their respective privacy policies regarding data retention.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
