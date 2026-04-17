# Auric Krystals

Ethically sourced crystals, bracelets, and astrology services — a full-stack Next.js e-commerce application with an admin dashboard for product, category, and order management.

**Live:** [auric-krystals.vercel.app](https://auric-krystals.vercel.app)

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL) — free tier
- **File Storage:** Supabase Storage (payment screenshots, product images)
- **Auth:** Supabase Auth (admin email/password login)
- **Notifications:** Nodemailer (Gmail SMTP) + Telegram Bot (optional)
- **Hosting:** Vercel

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the full schema from `supabase/schema.sql`
3. Create Storage buckets:
   - `screenshots` — public, for payment proof uploads
   - `product-images` — public, for product image uploads from admin
4. Create admin user(s) in **Authentication > Users** (email + password)
5. Copy your project URL, anon key, and service role key

### 3. Configure Environment

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (server-side only)
- `SMTP_USER` / `SMTP_PASS` — Gmail address + [App Password](https://myaccount.google.com/apppasswords)
- `NEXT_PUBLIC_UPI_ID` — Your UPI ID for payments
- `NEXT_PUBLIC_UPI_PAYEE` — Display name for UPI

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database Schema

The full schema lives in `supabase/schema.sql` and includes:

| Table | Purpose |
|---|---|
| `orders` | Customer orders with items, total, payment screenshot, status |
| `admin_settings` | Notification email/phone, UPI ID, Telegram config (singleton) |
| `quiz_registrations` | Users who registered via the crystal quiz |
| `categories` | Product categories (Crystals, Bracelets, etc.) |
| `products` | Full product catalog with images, pricing, descriptions, specs |

All tables have Row Level Security (RLS) enabled. Service role has full access; public can read active products/categories and insert orders/quiz registrations.

## Routes

### User-facing
| Route | Description |
|---|---|
| `/` | Home — hero, featured product carousel, offerings, attractions |
| `/shop` | Product grid with category filter tabs and Add to Cart |
| `/product/[slug]` | Product detail with image gallery, specifications, Add to Cart |
| `/services` | Astrology & wellness services |
| `/contact` | Contact form + social links |
| `/cart` | Full cart view with quantity controls |
| `/checkout` | Order form, dynamic UPI QR code, screenshot upload |
| `/terms` | Terms & Conditions / Privacy Policy |

### Admin Dashboard
| Route | Description |
|---|---|
| `/admin/login` | Admin login |
| `/admin` | Orders dashboard — filter, view, approve/reject |
| `/admin/products` | Product list — search, visibility toggle, edit/delete |
| `/admin/products/new` | Create new product with image upload |
| `/admin/products/[id]/edit` | Edit existing product |
| `/admin/categories` | Category management — inline add/rename/delete |
| `/admin/settings` | Notification email, phone, UPI ID, Telegram config |

### API
| Route | Method | Description |
|---|---|---|
| `/api/products` | GET | Public product list with category filter (`?category=slug`) |
| `/api/orders` | POST | Create order + upload payment screenshot |
| `/api/quiz-register` | POST | Submit quiz registration (name, DOB, email, phone) |
| `/api/admin/login` | POST | Admin authentication |
| `/api/admin/orders` | GET | List orders (paginated, filterable by status) |
| `/api/admin/orders/[id]` | GET/PATCH | Get or update order status |
| `/api/admin/products` | GET/POST | List or create products (with image upload) |
| `/api/admin/products/[id]` | GET/PATCH/DELETE | Get, update, or delete a product |
| `/api/admin/categories` | GET/POST | List or create categories |
| `/api/admin/categories/[id]` | PATCH/DELETE | Update or delete a category |
| `/api/admin/settings` | GET/PUT | Read or update admin settings |

## Features

- **Product Management:** Admin CRUD for products with up to 2 images, categories, pricing (INR), optional specifications, and active/draft toggle
- **Category Management:** Admin can create, rename, and delete categories; shop page shows filter tabs
- **Cart:** localStorage-backed, persists across sessions, real-time totals with bounce animation and toast notifications
- **Checkout:** Customer details form + dynamic UPI QR code (updates with cart total) + screenshot upload
- **Admin Dashboard:** Order management with approve/reject, product & category CRUD, configurable settings
- **Notifications:** Email (Gmail SMTP) on new orders + optional Telegram push
- **Crystal Quiz:** Interactive 7-question quiz with registration gate (Name, DOB, Mobile, Email) and marketing opt-in
- **Responsive:** Mobile-first design with glass-effect header, carousels, animations, reduced-motion support

## Order Flow

1. User browses `/shop` → adds items to cart (with visual feedback)
2. Goes to `/checkout` → fills customer details → pays via UPI link/QR
3. Uploads payment screenshot → places order
4. Admin gets email + Telegram notification
5. Admin reviews at `/admin` → approves or rejects

## Admin Product Flow

1. Admin logs in at `/admin/login`
2. Creates categories at `/admin/categories` (e.g., Crystals, Bracelets)
3. Adds products at `/admin/products/new` — title, price, description, images, category, optional specifications
4. Products appear on the public shop page and home carousel automatically
5. Toggle visibility with the eye icon, or edit/delete as needed

## Telegram Setup (Optional)

1. Message [@BotFather](https://t.me/BotFather) on Telegram → `/newbot`
2. Copy the bot token
3. Start a chat with your bot, then visit `https://api.telegram.org/bot<TOKEN>/getUpdates` to find your chat ID
4. Add both to admin settings or `.env.local`

## Deployment

The app is deployed on Vercel with GitHub integration. Every push to `main` triggers a new deployment.

```bash
# Or deploy manually
npx vercel
```

Set environment variables in the Vercel dashboard under Project Settings > Environment Variables.
