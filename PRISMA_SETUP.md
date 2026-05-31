# Prisma Setup Guide for WriteFlow AI

## What is Prisma?

Prisma is a modern database toolkit that provides:
- **Type-safe database client** - Auto-generated TypeScript types
- **Schema management** - Define your database structure in one file
- **Migrations** - Version control for your database
- **Query builder** - Easy-to-use API for database operations

---

## ✅ Your Current Prisma Setup

Your WriteFlow AI project already has Prisma configured with:
- **Database**: SQLite (file-based, perfect for development)
- **Location**: `prisma/dev.db`
- **Schema**: `prisma/schema.prisma`
- **Migrations**: Applied successfully
- **Seed data**: Demo users and templates loaded

---

## Prisma File Structure

```
writeflow-ai/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   ├── seed.ts                # Seed data script
│   ├── dev.db                 # SQLite database file
│   └── migrations/            # Migration history
│       ├── 20260525132308_init/
│       │   └── migration.sql
│       └── migration_lock.toml
├── .env                       # Environment variables
└── node_modules/
    └── .prisma/
        └── client/            # Generated Prisma Client
```

---

## Database Schema Overview

Your database has these models (tables):

### 1. **User** - User accounts
- Authentication (email/password, Google OAuth)
- Roles: `user`, `admin`
- Plans: `free`, `pro`, `team`
- Status: `active`, `banned`

### 2. **Account** - OAuth accounts (NextAuth)
- Links users to OAuth providers (Google, etc.)

### 3. **Session** - User sessions (NextAuth)
- Manages active user sessions

### 4. **Document** - User-created documents
- Drafts, published content
- Types: blog, social, email
- Links to users and templates

### 5. **Template** - Content templates
- Pre-built writing templates
- Categories, ratings, usage tracking

### 6. **Review** - Template reviews
- User ratings and feedback
- Approval workflow

### 7. **AILog** - AI usage tracking
- Tracks AI agent usage
- Token consumption
- Audit trail

### 8. **SiteSettings** - Global settings
- Site configuration
- Feature toggles
- Maintenance mode

---

## Common Prisma Commands

### 1. Generate Prisma Client
Generates TypeScript types and client code:
```bash
npm run db:generate
# or
npx prisma generate
```

**When to use:**
- After changing `schema.prisma`
- After pulling the project for the first time
- If you get "Cannot find module '@prisma/client'" error

### 2. Create Migration
Creates a new migration after schema changes:
```bash
npm run db:migrate
# or
npx prisma migrate dev --name your_migration_name
```

**When to use:**
- After modifying `schema.prisma`
- Adding new models/fields
- Changing relationships

### 3. Apply Migrations (Production)
Applies migrations without prompts:
```bash
npx prisma migrate deploy
```

**When to use:**
- In production environments
- In CI/CD pipelines

### 4. Reset Database
Drops database, applies all migrations, runs seed:
```bash
npx prisma migrate reset
```

**When to use:**
- Starting fresh in development
- Fixing migration conflicts
- Testing seed data

### 5. Seed Database
Populates database with initial data:
```bash
npm run db:seed
```

**When to use:**
- After resetting database
- Adding demo/test data

### 6. Open Prisma Studio
Visual database browser:
```bash
npm run db:studio
# or
npx prisma studio
```

**Opens:** `http://localhost:5555`

**Features:**
- View all tables
- Edit records
- Add/delete data
- Visual interface

### 7. Check Migration Status
See which migrations are applied:
```bash
npx prisma migrate status
```

### 8. Format Schema
Auto-format `schema.prisma`:
```bash
npx prisma format
```

---

## Using Prisma in Your Code

### Setup Prisma Client

Your project has a Prisma client instance at `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Basic CRUD Operations

#### Create a User
```typescript
import { prisma } from '@/lib/prisma'

const user = await prisma.user.create({
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    password: hashedPassword,
    role: 'user',
    plan: 'free'
  }
})
```

#### Find a User
```typescript
// Find by email
const user = await prisma.user.findUnique({
  where: { email: 'john@example.com' }
})

// Find by ID
const user = await prisma.user.findUnique({
  where: { id: 'user-id-here' }
})

// Find many with conditions
const users = await prisma.user.findMany({
  where: {
    role: 'user',
    status: 'active'
  },
  orderBy: { createdAt: 'desc' },
  take: 10 // Limit to 10 results
})
```

#### Update a User
```typescript
const user = await prisma.user.update({
  where: { id: 'user-id' },
  data: {
    name: 'Jane Doe',
    plan: 'pro'
  }
})
```

#### Delete a User
```typescript
await prisma.user.delete({
  where: { id: 'user-id' }
})
```

#### Create with Relations
```typescript
// Create document with user relation
const document = await prisma.document.create({
  data: {
    title: 'My Blog Post',
    content: 'Content here...',
    type: 'blog',
    status: 'draft',
    userId: 'user-id',
    templateId: 'template-id'
  }
})
```

#### Query with Relations
```typescript
// Get user with all documents
const user = await prisma.user.findUnique({
  where: { id: 'user-id' },
  include: {
    documents: true,
    aiLogs: true,
    reviews: true
  }
})

// Get documents with user and template
const documents = await prisma.document.findMany({
  include: {
    user: true,
    template: true
  }
})
```

#### Count Records
```typescript
const userCount = await prisma.user.count()

const activeUsers = await prisma.user.count({
  where: { status: 'active' }
})
```

#### Aggregate Data
```typescript
const stats = await prisma.aILog.aggregate({
  _sum: { tokensUsed: true },
  _avg: { tokensUsed: true },
  _count: true,
  where: { userId: 'user-id' }
})
```

---

## Modifying the Schema

### Adding a New Field

1. Edit `prisma/schema.prisma`:
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  password      String?
  phoneNumber   String?   // New field
  // ... rest of fields
}
```

2. Create migration:
```bash
npx prisma migrate dev --name add_phone_number
```

3. Generate client:
```bash
npx prisma generate
```

### Adding a New Model

1. Edit `prisma/schema.prisma`:
```prisma
model Subscription {
  id          String   @id @default(cuid())
  userId      String
  plan        String
  status      String
  startDate   DateTime @default(now())
  endDate     DateTime?
  createdAt   DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// Don't forget to add relation to User model
model User {
  // ... existing fields
  subscriptions Subscription[]
}
```

2. Create migration:
```bash
npx prisma migrate dev --name add_subscription_model
```

---

## Environment Variables

Your `.env` file should have:

```env
DATABASE_URL="file:./dev.db"
```

### For Different Databases:

**PostgreSQL:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/writeflow"
```

**MySQL:**
```env
DATABASE_URL="mysql://user:password@localhost:3306/writeflow"
```

**SQLite (current):**
```env
DATABASE_URL="file:./dev.db"
```

---

## Prisma Studio

Visual database browser - very useful for development!

### Start Prisma Studio:
```bash
npm run db:studio
```

### Features:
- 📊 View all tables and data
- ✏️ Edit records directly
- ➕ Add new records
- 🗑️ Delete records
- 🔍 Filter and search
- 🔗 Navigate relationships

**Access:** `http://localhost:5555`

---

## Best Practices

### 1. Always Use Prisma Client Instance
```typescript
// ✅ Good - Use shared instance
import { prisma } from '@/lib/prisma'

// ❌ Bad - Creates new instance
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
```

### 2. Handle Errors Properly
```typescript
try {
  const user = await prisma.user.create({ data: {...} })
} catch (error) {
  if (error.code === 'P2002') {
    // Unique constraint violation
    console.error('Email already exists')
  }
  throw error
}
```

### 3. Use Transactions for Multiple Operations
```typescript
await prisma.$transaction([
  prisma.user.update({ where: { id: userId }, data: { plan: 'pro' } }),
  prisma.aILog.create({ data: { userId, agentUsed: 'upgrade', ... } })
])
```

### 4. Close Connection in Serverless
```typescript
// In API routes (Next.js handles this automatically)
// But for scripts:
await prisma.$disconnect()
```

### 5. Use Select to Limit Fields
```typescript
// ✅ Good - Only fetch needed fields
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { id: true, name: true, email: true }
})

// ❌ Bad - Fetches all fields including password hash
const user = await prisma.user.findUnique({
  where: { id: userId }
})
```

---

## Troubleshooting

### Error: "Cannot find module '@prisma/client'"
**Solution:**
```bash
npm run db:generate
```

### Error: "Environment variable not found: DATABASE_URL"
**Solution:** Check your `.env` file exists and has `DATABASE_URL`

### Error: "Migration failed"
**Solution:** Reset and try again:
```bash
npx prisma migrate reset
```

### Error: "EPERM: operation not permitted"
**Solution:** Close all processes using the database:
- Close Prisma Studio
- Stop dev server
- Close VS Code
- Restart terminal

### Database is locked
**Solution:**
```bash
# Close all connections
# Then restart
npm run dev
```

---

## Demo Accounts (From Seed)

Your database is seeded with:

**Regular User:**
- Email: `user@writeflow.com`
- Password: `password123`
- Role: `user`
- Plan: `free`

**Admin User:**
- Email: `admin@writeflow.com`
- Password: `admin123`
- Role: `admin`
- Plan: `pro`

**Templates:** 8 pre-built templates across different categories

---

## Quick Reference

| Task | Command |
|------|---------|
| Generate client | `npm run db:generate` |
| Create migration | `npm run db:migrate` |
| Reset database | `npx prisma migrate reset` |
| Seed database | `npm run db:seed` |
| Open Studio | `npm run db:studio` |
| Check status | `npx prisma migrate status` |
| Format schema | `npx prisma format` |

---

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Prisma Examples](https://github.com/prisma/prisma-examples)

---

## Your Setup is Complete! ✅

Everything is already configured and working:
- ✅ Schema defined
- ✅ Migrations applied
- ✅ Database seeded
- ✅ Client generated
- ✅ Ready to use

Just run `npm run dev` and start building! 🚀
