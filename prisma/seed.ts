const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  console.log("Starting seeding...")

  // Create or update Demo User
  const userPassword = await bcrypt.hash("123456", 10)
  const user = await prisma.user.upsert({
    where: { email: "user@writeflow.com" },
    update: {
      password: userPassword,
      role: "user",
      name: "Demo User",
      plan: "free"
    },
    create: {
      email: "user@writeflow.com",
      password: userPassword,
      role: "user",
      name: "Demo User",
      plan: "free"
    }
  })
  console.log("Demo User Created:", user.email)

  // Create or update Demo Admin
  const adminPassword = await bcrypt.hash("123456", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@writeflow.com" },
    update: {
      password: adminPassword,
      role: "admin",
      name: "Demo Admin",
      plan: "pro"
    },
    create: {
      email: "admin@writeflow.com",
      password: adminPassword,
      role: "admin",
      name: "Demo Admin",
      plan: "pro"
    }
  })
  console.log("Demo Admin Created:", admin.email)

  // Seed some templates for the explore/landing pages
  const templates = [
    {
      title: "Blog Post Generator",
      description: "Generate a complete, SEO-optimized blog post on any topic in seconds.",
      category: "Blog",
      prompt: "Write a detailed and engaging blog post about [Topic]. Keep the tone [Tone] and ensure it targets the keyword [Keyword].",
      sampleOutput: "Here is an engaging blog post about AI...",
      rating: 4.8,
      usageCount: 12500,
      tone: "Professional",
      wordCount: "1000-1500",
      aiModel: "GPT-4o"
    },
    {
      title: "Social Media Caption",
      description: "Create catchy captions for Instagram, Twitter, and Facebook.",
      category: "Social Media",
      prompt: "Write 3 engaging social media captions for a post about [Topic]. Make sure to include relevant hashtags.",
      sampleOutput: "1. So excited to announce... #news #update\n2. Did you know...? #facts",
      rating: 4.9,
      usageCount: 45000,
      tone: "Friendly",
      wordCount: "50-100",
      aiModel: "Claude 3.5 Sonnet"
    },
    {
      title: "Cold Email Outreach",
      description: "Write high-converting cold emails that get responses.",
      category: "Email",
      prompt: "Write a persuasive cold email to a [Role] at [Company] pitching our product, [Product]. The goal is to book a 15-minute call.",
      sampleOutput: "Subject: Quick question about your workflow at [Company]...\n\nHi [Name], I noticed...",
      rating: 4.5,
      usageCount: 8400,
      tone: "Persuasive",
      wordCount: "150-250",
      aiModel: "GPT-4o"
    },
    {
      title: "Facebook Ad Copy",
      description: "Generate scroll-stopping ad copy for your next campaign.",
      category: "Ad Copy",
      prompt: "Write 2 versions of a Facebook ad promoting [Product]. Use the PAS (Problem-Agitate-Solution) framework.",
      sampleOutput: "Tired of wasting hours on...? We get it. That's why we built...",
      rating: 4.7,
      usageCount: 15300,
      tone: "Persuasive",
      wordCount: "100-200",
      aiModel: "GPT-4o"
    }
  ]

  console.log("Seeding templates...")
  for (const t of templates) {
    // Check if it exists by title
    const exists = await prisma.template.findFirst({ where: { title: t.title } })
    if (!exists) {
      await prisma.template.create({ data: t })
    }
  }
  console.log("Templates seeded.")

  // Seed Site Settings
  const settings = await prisma.siteSettings.findFirst()
  if (!settings) {
    await prisma.siteSettings.create({
      data: {
        siteName: "WriteFlow AI",
        maintenanceMode: false
      }
    })
    console.log("Site settings initialized.")
  }

  console.log("Seeding finished.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
