# NextAuth Setup Guide for WriteFlow AI

This guide will help you set up NextAuth authentication in your WriteFlow AI application.

## Current Authentication Setup

Your application supports two authentication methods:
1. **Email/Password (Credentials)** - Already working
2. **Google OAuth** - Requires configuration

## Prerequisites

Make sure you have:
- ✅ Database set up (SQLite with Prisma)
- ✅ NextAuth installed
- ✅ Environment variables configured

## Step 1: Generate NextAuth Secret

The `NEXTAUTH_SECRET` is used to encrypt JWT tokens. Generate a secure secret:

### Option A: Using OpenSSL (Recommended)
```bash
openssl rand -base64 32
```

### Option B: Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Option C: Online Generator
Visit: https://generate-secret.vercel.app/32

Copy the generated secret and update your `.env` file:
```env
NEXTAUTH_SECRET="your-generated-secret-here"
```

## Step 2: Set NextAuth URL

Update the `NEXTAUTH_URL` in your `.env` file:

**For Development:**
```env
NEXTAUTH_URL="http://localhost:3000"
```

**For Production:**
```env
NEXTAUTH_URL="https://yourdomain.com"
```

## Step 3: Database Setup

Your database is already configured with the correct schema. Run migrations if you haven't:

```bash
npm run db:generate
npm run db:migrate
```

## Step 4: Google OAuth Setup (Optional)

If you want to enable Google login:

### 4.1 Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure the OAuth consent screen if prompted:
   - User Type: External
   - App name: WriteFlow AI
   - User support email: your email
   - Developer contact: your email
6. Select **Application type**: Web application
7. Add **Authorized JavaScript origins**:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
8. Add **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
9. Click **Create**
10. Copy the **Client ID** and **Client Secret**

### 4.2 Update Environment Variables

Add your Google credentials to `.env`:
```env
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Step 5: Test Authentication

### Test Email/Password Login

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/register`

3. Create a new account with:
   - Name
   - Email
   - Password

4. Go to `http://localhost:3000/login`

5. Log in with your credentials

### Test Google OAuth (if configured)

1. Go to `http://localhost:3000/login`
2. Click the Google sign-in button
3. Authorize the application
4. You should be redirected back and logged in

## Current Configuration

Your NextAuth is configured with:

### Providers
- ✅ **Credentials Provider**: Email/Password authentication
- ⚙️ **Google Provider**: Requires Google OAuth credentials

### Session Strategy
- **Type**: JWT (JSON Web Tokens)
- **Storage**: Client-side cookies

### Callbacks
- **JWT Callback**: Adds user role and ID to token
- **Session Callback**: Adds user role and ID to session

### Pages
- **Sign In**: `/login`
- **Sign Up**: `/register`

### User Roles
- `user` (default)
- `admin`

### User Plans
- `free` (default)
- `pro`
- `team`

## Environment Variables Summary

Your `.env` file should have:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Groq AI
GROQ_API_KEY="your-groq-api-key-here"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Troubleshooting

### Issue: "Invalid credentials" when logging in
- Check that the user exists in the database
- Verify the password is correct
- Check database connection

### Issue: "Configuration error" on Google login
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
- Check redirect URIs in Google Console match exactly
- Ensure OAuth consent screen is configured

### Issue: Session not persisting
- Verify `NEXTAUTH_SECRET` is set and not empty
- Check that cookies are enabled in browser
- Clear browser cookies and try again

### Issue: "NEXTAUTH_URL" error
- Make sure `NEXTAUTH_URL` matches your current domain
- Don't include trailing slash
- Use `http://` for localhost, `https://` for production

## Accessing User Session

### In Server Components
```typescript
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export default async function Page() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return <div>Not authenticated</div>
  }
  
  return <div>Welcome {session.user.name}</div>
}
```

### In API Routes
```typescript
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return new Response("Unauthorized", { status: 401 })
  }
  
  // Your logic here
}
```

### In Client Components
```typescript
"use client"
import { useSession } from "next-auth/react"

export default function Component() {
  const { data: session, status } = useSession()
  
  if (status === "loading") {
    return <div>Loading...</div>
  }
  
  if (!session) {
    return <div>Not authenticated</div>
  }
  
  return <div>Welcome {session.user.name}</div>
}
```

## Security Best Practices

1. ✅ **Never commit `.env` file** - It's already in `.gitignore`
2. ✅ **Use strong NEXTAUTH_SECRET** - At least 32 characters
3. ✅ **Hash passwords** - Already using bcryptjs
4. ✅ **Use HTTPS in production** - Required for secure cookies
5. ✅ **Validate user input** - Always sanitize and validate
6. ✅ **Implement rate limiting** - Prevent brute force attacks
7. ✅ **Use secure session strategy** - JWT is already configured

## Next Steps

1. Generate and set `NEXTAUTH_SECRET`
2. Test email/password authentication
3. (Optional) Configure Google OAuth
4. Deploy to production with proper environment variables

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [NextAuth.js with App Router](https://next-auth.js.org/configuration/initialization#route-handlers-app)
- [Google OAuth Setup](https://next-auth.js.org/providers/google)
- [Prisma Adapter](https://next-auth.js.org/adapters/prisma)
