import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Scale, CreditCard, Copyright, CheckCircle2, AlertCircle } from "lucide-react"

export default function TermsPage() {
  const sections = [
    {
      id: "acceptance",
      icon: <CheckCircle2 className="w-5 h-5 text-violet-400" />,
      title: "1. Acceptance of Terms",
      content: "By accessing or using WriteFlow AI, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service. We reserve the right to modify these terms at any time.",
    },
    {
      id: "subscriptions",
      icon: <CreditCard className="w-5 h-5 text-fuchsia-400" />,
      title: "2. Subscriptions & Billing",
      content: "Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis. You may cancel your subscription at any time, but we do not offer refunds for partial months of service.",
    },
    {
      id: "ownership",
      icon: <Copyright className="w-5 h-5 text-blue-400" />,
      title: "3. Content Ownership",
      content: "You retain full ownership, copyright, and intellectual property rights to any content you generate using our AI tools. We do not claim copyright over AI-generated outputs.",
    },
    {
      id: "usage",
      icon: <AlertCircle className="w-5 h-5 text-emerald-400" />,
      title: "4. Acceptable Use",
      content: "You agree not to use the Service to generate harmful, illegal, or abusive content. We reserve the right to terminate accounts that violate our usage policies without prior notice.",
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30">
      {/* Background gradients */}
      <div className="absolute top-0 inset-x-0 h-[80vh] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-fuchsia-600/10 blur-[100px]" />
      </div>

      <Navbar />
      
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-32 sm:py-40">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-2xl mb-6 shadow-xl">
            <Scale className="w-8 h-8 text-violet-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Service</span></h1>
          <p className="text-gray-400 text-lg">Last updated: May 28, 2026</p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.id} className="group bg-white/[0.02] border border-white/5 hover:border-white/10 p-8 rounded-3xl transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="mt-1 p-3 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-3 text-white group-hover:text-violet-200 transition-colors">{section.title}</h2>
                  <p className="text-gray-400 leading-relaxed">{section.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
