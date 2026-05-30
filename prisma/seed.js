require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({});

async function main() {
  console.log('🌱 Seeding database...');
  const h = await bcrypt.hash('123456', 10);

  await prisma.user.upsert({
    where: { email: 'user@writeflow.com' },
    update: {},
    create: { name: 'Demo User', email: 'user@writeflow.com', password: h, role: 'user', plan: 'pro', bio: 'Content creator and marketing enthusiast.', status: 'active' }
  });

  await prisma.user.upsert({
    where: { email: 'admin@writeflow.com' },
    update: {},
    create: { name: 'Admin User', email: 'admin@writeflow.com', password: h, role: 'admin', plan: 'team', bio: 'Platform administrator.', status: 'active' }
  });

  try {
    await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: {},
      create: { id: 'default', siteName: 'WriteFlow AI', maintenanceMode: false, draftAgent: true, rewriteAgent: true, chatAgent: true }
    });
  } catch(e) { console.log('SiteSettings note:', e.message); }

  const templates = [
    { title: 'SEO Blog Post', description: 'Generate a fully optimized blog post ranked for search engines.', category: 'blog', prompt: 'Write a comprehensive SEO-optimized blog post about {topic} targeting {audience}. Tone: {tone}.', sampleOutput: 'Here is a sample SEO blog post about "AI in Marketing" targeting digital marketers...', tone: 'professional', wordCount: '800-1200', aiModel: 'GPT-4o', usageCount: 4821, rating: 4.8, ratingCount: 312 },
    { title: 'LinkedIn Post', description: 'Create an engaging LinkedIn post that builds your professional brand.', category: 'social', prompt: 'Write a compelling LinkedIn post about {topic}. Tone: {tone}. Audience: {audience}.', sampleOutput: 'Excited to share insights on AI-powered content creation...', tone: 'professional', wordCount: '150-300', aiModel: 'GPT-4o', usageCount: 3290, rating: 4.7, ratingCount: 210 },
    { title: 'Email Newsletter', description: 'Craft an email newsletter that drives opens, clicks, and conversions.', category: 'email', prompt: 'Write an engaging email newsletter about {topic} for {audience}. Tone: {tone}.', sampleOutput: 'Subject: Your weekly dose of AI insights is here!', tone: 'friendly', wordCount: '400-600', aiModel: 'GPT-4o', usageCount: 2755, rating: 4.6, ratingCount: 180 },
    { title: 'Twitter/X Thread', description: 'Write a viral Twitter thread that expands your reach and followers.', category: 'social', prompt: 'Write a Twitter thread about {topic} with {tone} tone for {audience}.', sampleOutput: "1/ AI is changing how we create content forever. Here's everything you need to know 🧵", tone: 'casual', wordCount: '200-400', aiModel: 'GPT-4o', usageCount: 5120, rating: 4.9, ratingCount: 405 },
    { title: 'Facebook Ad Copy', description: 'Generate high-converting Facebook ad copy for your product or service.', category: 'ad', prompt: 'Write compelling Facebook ad copy for {topic} targeting {audience}. Tone: {tone}.', sampleOutput: '🎯 Stop scrolling! WriteFlow AI helps you create content 10x faster...', tone: 'persuasive', wordCount: '100-200', aiModel: 'GPT-4o', usageCount: 1980, rating: 4.5, ratingCount: 145 },
    { title: 'Product Description', description: 'Write compelling product descriptions that convert browsers into buyers.', category: 'ad', prompt: 'Write an engaging product description for {topic} targeting {audience}. Tone: {tone}.', sampleOutput: 'Introducing the smartest way to create content at scale...', tone: 'persuasive', wordCount: '150-300', aiModel: 'GPT-4o', usageCount: 2100, rating: 4.6, ratingCount: 155 },
    { title: 'Cold Email Outreach', description: 'Generate personalized cold emails that get replies and book meetings.', category: 'email', prompt: 'Write a cold email for {topic} targeting {audience} with a {tone} tone.', sampleOutput: 'Hi {{name}}, I noticed your company is growing rapidly and thought...', tone: 'professional', wordCount: '150-250', aiModel: 'GPT-4o', usageCount: 3400, rating: 4.7, ratingCount: 230 },
    { title: 'Instagram Caption', description: 'Craft scroll-stopping Instagram captions with hashtags.', category: 'social', prompt: 'Write an Instagram caption for {topic} targeting {audience} with a {tone} tone. Include hashtags.', sampleOutput: 'Creating magic with words, one post at a time ✨\n\n#ContentCreation #AIWriting', tone: 'friendly', wordCount: '100-200', aiModel: 'GPT-4o', usageCount: 4500, rating: 4.8, ratingCount: 340 },
  ];

  for (const t of templates) {
    try { await prisma.template.create({ data: t }); } catch(e) {}
  }

  const user = await prisma.user.findUnique({ where: { email: 'user@writeflow.com' } });

  try {
    await prisma.document.createMany({
      data: [
        { title: 'The Future of AI in Content Marketing', content: 'AI is revolutionizing the way businesses create and distribute content...', status: 'published', type: 'blog', wordCount: 950, userId: user.id },
        { title: 'Q4 Email Campaign Draft', content: 'Hi team, here is the draft for our Q4 email campaign...', status: 'draft', type: 'email', wordCount: 320, userId: user.id }
      ]
    });
  } catch(e) {}

  try {
    await prisma.aILog.createMany({
      data: [
        { agentUsed: 'draft', promptSnippet: 'Write a blog post about AI in content marketing...', tokensUsed: 1240, userId: user.id },
        { agentUsed: 'rewrite', promptSnippet: 'Rewrite this paragraph in a casual tone...', tokensUsed: 420, userId: user.id }
      ]
    });
  } catch(e) {}

  const tmpl = await prisma.template.findFirst();
  if (tmpl) {
    try {
      await prisma.review.create({
        data: { rating: 5, content: 'This template saved me hours of work. The AI output was incredibly well-structured!', status: 'approved', userId: user.id, templateId: tmpl.id }
      });
    } catch(e) {}
  }

  console.log('✅ Seeding complete!');
  console.log('👤 user@writeflow.com / 123456');
  console.log('🔑 admin@writeflow.com / 123456');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
