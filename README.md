# WriteFlow AI ✍️🚀

The ultimate AI writing workspace. Generate, refine, and organize your highest-performing content at lightspeed. WriteFlow AI combines powerful specialized AI agents with a sleek, premium, highly interactive dashboard.

## 🔗 Live Site URL
* **Live Deployment:** [https://writeflow-ai.vercel.app](https://writeflow-ai.vercel.app)

---

## 🔑 Demo Credentials
You can log in and test the application instantly using the following pre-configured credentials:

### 👤 Regular User
* **Email:** `user@writeflow.com`
* **Password:** `123456`

### 🔑 Administrator
* **Email:** `admin@writeflow.com`
* **Password:** `admin123`

---

## 🛠️ Tech Stack
* **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Server Components)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Animations:** [Framer Motion](https://www.framer.com/motion/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **API Client:** [Axios](https://axios-http.com/)
* **Notifications:** [Sonner](https://interface.custom-toast.com/)

---

## 🚀 How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/SiratimMChy/WriteFlowAI.git
cd WriteFlowAI
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` or `.env.local` file in the root directory and add the following variables:
```env
NEXT_PUBLIC_API_URL=https://writeflowai-backend.onrender.com/api
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 📡 API Endpoints List
The application integrates with the following backend API endpoints (base URL: `https://writeflowai-backend.onrender.com/api`):

### 🔑 Authentication Endpoints
* `POST /auth/register` - Create a new user account
* `POST /auth/login` - Authenticate user credentials and return a token
* `POST /auth/logout` - Sign out the user session
* `GET /auth/profile` - Retrieve current logged-in user profile details

### 📄 Documents Endpoints
* `GET /documents` - Fetch a paginated list of generated documents
* `POST /documents/save` - Save a generated draft or rewritten document
* `GET /documents/:id` - Retrieve a single document detail
* `PUT /documents/:id` - Update an existing document
* `DELETE /documents/:id` - Permanently delete a document

### 🤖 AI Agent Endpoints
* `POST /draft` - Connect to the AI Drafting Agent to generate structured long-form content
* `POST /rewrite` - Connect to the AI Rewrite Agent to shorten, lengthen, fix grammar, or adapt tone
* `POST /ai/chat` - Connect to the AI Chat Assistant for brainstorming and interactive support

### 📊 Admin Endpoints
* `GET /dashboard/stats` - Retrieve usage stats for user and admin dashboards
* `GET /dashboard/admin/analytics` - Fetch advanced system-wide analytics (admins only)
* `GET /dashboard/admin/users` - Manage registered users list (admins only)
* `GET /dashboard/admin/templates` - Add/modify/delete library templates (admins only)
* `GET /settings` - Fetch site configuration details (e.g. siteName, maintenanceMode)
