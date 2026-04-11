# Auric Krystals

Ethically sourced crystals, bracelets, and astrology services — a full-stack Next.js e-commerce application.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL) — free tier
- **File Storage:** Supabase Storage (payment screenshots)
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
2. Go to **SQL Editor** and run the schema from `supabase/schema.sql`
3. Create a **Storage bucket** called `screenshots` (set to public)
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

## Routes

### User-facing
| Route | Description |
|---|---|
| `/` | Home — hero, featured products, offerings, attractions |
| `/shop` | Product grid with Add to Cart |
| `/product/[slug]` | Product detail with Add to Cart |
| `/services` | Astrology & wellness services |
| `/contact` | Contact form + social links |
| `/cart` | Full cart view |
| `/checkout` | Order form, UPI payment, screenshot upload |

### Admin
| Route | Description |
|---|---|
| `/admin/login` | Admin login |
| `/admin` | Orders dashboard (filter, view, approve/reject) |
| `/admin/settings` | Notification email, phone, UPI ID, Telegram config |

### API
| Route | Method | Description |
|---|---|---|
| `/api/orders` | POST | Create order + upload screenshot |
| `/api/admin/login` | POST | Admin authentication |
| `/api/admin/orders` | GET | List orders (admin) |
| `/api/admin/orders/[id]` | GET/PATCH | Get/update order (admin) |
| `/api/admin/settings` | GET/PUT | Admin settings (admin) |

## Features

- **Cart:** localStorage-backed, persists across sessions, real-time totals
- **Checkout:** Customer details form + UPI amount-prefilled deep link + screenshot upload
- **Admin:** Order management with approve/reject workflow
- **Notifications:** Email (Gmail SMTP) on new orders + optional Telegram push
- **Crystal Quiz:** Interactive 7-question quiz recommending crystals
- **Responsive:** Mobile-first design with glass-effect header, carousels, animations

## Order Flow

1. User browses `/shop` → adds items to cart
2. Goes to `/checkout` → fills details → pays via UPI link/QR
3. Uploads payment screenshot → places order
4. Admin gets email + Telegram notification
5. Admin reviews at `/admin` → approves or rejects

## Telegram Setup (Optional)

1. Message [@BotFather](https://t.me/BotFather) on Telegram → `/newbot`
2. Copy the bot token
3. Start a chat with your bot, then visit `https://api.telegram.org/bot<TOKEN>/getUpdates` to find your chat ID
4. Add both to admin settings or `.env.local`

## Deployment

```bash
# Deploy to Vercel
npx vercel
```

Set environment variables in Vercel dashboard.
