import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ShieldCheck, Database, Eye, Cpu, Lock } from "lucide-react"

export default function PrivacyPage() {
  const sections = [
    {
      id: "collection",
      icon: <Database className="w-5 h-5 text-violet-400" />,
      title: "1. Information We Collect",
      content: "We collect information you provide directly to us, such as when you create an account, manage your profile, or contact support. This includes your name and email address.",
    },
    {
      id: "usage",
      icon: <Eye className="w-5 h-5 text-fuchsia-400" />,
      title: "2. How We Use Your Information",
      content: "We use the information we collect to provide, maintain, and improve our services. This includes authenticating users, processing transactions, and sending important account updates or promotional materials.",
    },
    {
      id: "ai",
      icon: <Cpu className="w-5 h-5 text-violet-400" />,
      title: "3. AI Processing & Third Parties",
      content: "The content you generate using WriteFlow AI is processed by third-party LLM providers (such as Groq, OpenAI, etc.). We do not use your private data to train our own models without your explicit consent.",
    },
    {
      id: "security",
      icon: <Lock className="w-5 h-5 text-fuchsia-400" />,
      title: "4. Data Security",
      content: "We implement robust security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure, so we cannot guarantee absolute security.",
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30">
      {/* Background gradients */}
      <div className="absolute top-0 inset-x-0 h-[80vh] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-fuchsia-600/10 blur-[100px]" />
      </div>

      <Navbar />
      
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-32 sm:py-40">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-2xl mb-6 shadow-xl">
            <ShieldCheck className="w-8 h-8 text-violet-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Policy</span></h1>
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
