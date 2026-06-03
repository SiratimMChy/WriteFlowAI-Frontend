import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const templates = [
    { id: "seo-long-form", category: "Blog", title: "SEO Long-form Post", usageCount: 12500, rating: 4.9, description: "Generate structured, SEO-optimized blog posts complete with headers, keywords, and intro.", prompt: "Write an SEO long-form post." },
    { id: "viral-twitter", category: "Social Media", title: "Viral Twitter Thread", usageCount: 8200, rating: 4.8, description: "Create highly engaging Twitter/X threads that drive clicks, retweets, and followers.", prompt: "Write a viral twitter thread." },
    { id: "cold-outreach", category: "Email", title: "Cold Outreach Sequence", usageCount: 15000, rating: 4.7, description: "Write professional email sequences that get high response rates and conversions.", prompt: "Write a cold outreach email." },
    { id: "insta-caption", category: "Social Media", title: "Instagram Caption Maker", usageCount: 10400, rating: 4.8, description: "Generate witty, engaging Instagram captions with targeted hashtags.", prompt: "Write an Instagram caption." },
  ]

  for (const t of templates) {
    await prisma.template.upsert({
      where: { id: t.id },
      update: {},
      create: t,
    })
  }

  console.log('Seeded templates')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
