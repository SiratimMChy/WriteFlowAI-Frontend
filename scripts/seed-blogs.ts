import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const posts = [
  {
    slug: "10x-content-output-ai",
    title: "How to 10x your content output with AI without losing your brand voice",
    description: "Learn the exact frameworks used by top creators and enterprises to scale their content production, maintain quality, and keep their unique voice intact using advanced AI writing agents.",
    category: "Guides",
    readTime: "8 min read",
    imageGrad: "from-violet-600 via-fuchsia-600 to-blue-600",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2000",
    published: true,
    content: `
      <p class="text-xl text-gray-300 leading-relaxed mb-8 font-light">
        Welcome to this comprehensive guide on leveraging AI to supercharge your content creation process. Whether you're a solo creator or a marketing team, these strategies will save you hours every week.
      </p>
      
      <h2 class="font-heading text-3xl font-bold mt-12 mb-6 text-white">The Framework for Success</h2>
      <p class="text-gray-400 mb-6 leading-relaxed">
        Content creation isn't just about putting words on a page. It's about structuring your thoughts in a way that resonates with your audience. AI agents can help you map out these structures rapidly.
      </p>
      
      <div class="p-6 rounded-2xl bg-white/5 border border-white/10 my-8">
        <h3 class="font-heading text-xl font-bold text-violet-400 mb-3">Pro Tip</h3>
        <p class="text-gray-300 text-sm">Always provide context to your AI agent. The more background information it has about your brand voice and target audience, the better the output.</p>
      </div>

      <h2 class="font-heading text-3xl font-bold mt-12 mb-6 text-white">Scaling Without Losing Your Voice</h2>
      <p class="text-gray-400 mb-6 leading-relaxed">
        One of the biggest concerns with AI-generated content is that it sounds robotic or generic. The key to avoiding this is training your agents on your past successful content.
      </p>
      <ul class="list-disc pl-6 text-gray-400 space-y-3 mb-8">
        <li>Analyze your best-performing posts</li>
        <li>Extract the tone, vocabulary, and formatting</li>
        <li>Create a custom prompt incorporating these elements</li>
        <li>Iterate and refine based on performance</li>
      </ul>
      
      <p class="text-gray-400 mb-6 leading-relaxed">
        By following this approach, you can maintain a consistent brand voice across all your channels while producing content at 10x the speed.
      </p>
    `
  },
  {
    slug: "seo-optimization-2024",
    title: "The Ultimate Guide to SEO Optimization with AI in 2024",
    description: "Discover how search algorithms are changing and how you can use AI to stay ahead of the curve.",
    category: "SEO",
    readTime: "6 min read",
    imageGrad: "from-blue-500 to-cyan-500",
    imageUrl: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&q=80&w=2000",
    published: true,
    content: `
      <p class="text-xl text-gray-300 leading-relaxed mb-8 font-light">
        SEO is changing faster than ever. What worked in 2023 might not work today. Learn how to adapt your strategy using AI.
      </p>
      <h2 class="font-heading text-3xl font-bold mt-12 mb-6 text-white">Keyword Intent is Everything</h2>
      <p class="text-gray-400 mb-6 leading-relaxed">
        Search engines are getting smarter. They don't just look for exact match keywords anymore; they look for intent. Your content must answer the user's underlying question.
      </p>
    `
  },
  {
    slug: "social-media-hooks",
    title: "50 AI-Generated Social Media Hooks That Actually Work",
    description: "Stop guessing what works. We analyzed 10,000 viral posts and created prompts to generate the perfect hooks.",
    category: "Social Media",
    readTime: "5 min read",
    imageGrad: "from-emerald-500 to-teal-500",
    imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=2000",
    published: true,
    content: `
      <p class="text-xl text-gray-300 leading-relaxed mb-8 font-light">
        The first 3 seconds are crucial. If your hook doesn't grab attention, your content won't be seen. Here is how AI can help you write better hooks.
      </p>
      <h2 class="font-heading text-3xl font-bold mt-12 mb-6 text-white">The Psychology of a Hook</h2>
      <p class="text-gray-400 mb-6 leading-relaxed">
        A good hook plays on curiosity, fear of missing out, or offers immense value upfront. Use our AI templates to generate dozens of options and pick the best one.
      </p>
    `
  },
  {
    slug: "cold-email-playbook",
    title: "The Cold Email Playbook: Getting 40% Open Rates",
    description: "How to use our Cold Outreach Template to write personalized emails at scale that get responses.",
    category: "Email",
    readTime: "7 min read",
    imageGrad: "from-orange-500 to-red-500",
    imageUrl: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=2000",
    published: true,
    content: `
      <p class="text-xl text-gray-300 leading-relaxed mb-8 font-light">
        Cold emailing isn't dead; it's just evolved. Personalized, value-driven emails are the only way to get responses in today's crowded inbox.
      </p>
      <h2 class="font-heading text-3xl font-bold mt-12 mb-6 text-white">Personalization at Scale</h2>
      <p class="text-gray-400 mb-6 leading-relaxed">
        Using AI, you can analyze a prospect's LinkedIn profile or company website and generate a highly personalized opening line in seconds.
      </p>
    `
  },
  {
    slug: "building-brand-voice",
    title: "Building a Custom Brand Voice for Your AI Agents",
    description: "A step-by-step tutorial on training WriteFlow AI to sound exactly like your brand's style guide.",
    category: "Tutorials",
    readTime: "10 min read",
    imageGrad: "from-pink-500 to-rose-500",
    imageUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=2000",
    published: true,
    content: `
      <p class="text-xl text-gray-300 leading-relaxed mb-8 font-light">
        Your brand voice is your unique identifier. It's how your audience recognizes you. Learn how to train your AI agents to mimic this voice perfectly.
      </p>
      <h2 class="font-heading text-3xl font-bold mt-12 mb-6 text-white">Defining Your Style Guide</h2>
      <p class="text-gray-400 mb-6 leading-relaxed">
        Before you can train an AI, you need a clear definition of your brand voice. Is it formal or informal? Humorous or serious? Document these guidelines first.
      </p>
    `
  }
]

async function main() {
  console.log('Start seeding...')

  // Get or create a dummy user to be the author
  let author = await prisma.user.findFirst({
    where: { email: 'admin@writeflow.com' }
  })

  if (!author) {
    author = await prisma.user.create({
      data: {
        email: 'admin@writeflow.com',
        name: 'Sarah Jenkins',
        role: 'admin',
        plan: 'pro'
      }
    })
  }

  for (const p of posts) {
    const existing = await (prisma as any).blogPost.findUnique({
      where: { slug: p.slug }
    })
    
    if (!existing) {
      const blogPost = await (prisma as any).blogPost.create({
        data: {
          ...p,
          authorId: author.id
        }
      })
      console.log(`Created post with id: ${blogPost.id}`)
    } else {
      console.log(`Post ${p.slug} already exists`)
    }
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
