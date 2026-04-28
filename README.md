# Auric Krystals

Ethically sourced crystals, bracelets, and astrology services — a full-stack Next.js e-commerce application with a fully editorial admin dashboard (products, categories, testimonials, about, trust bar, social strip, quiz mappings, orders).

**Live:** [aurickrystals.in](https://www.aurickrystals.in)
**Mirror:** [auric-krystals.vercel.app](https://auric-krystals.vercel.app)

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL) — free tier
- **File Storage:** Supabase Storage (payment screenshots, product images, testimonial avatars, social posts, Krupali portrait)
- **Auth:** Supabase Auth (admin email/password login with auto-refreshing browser session)
- **Notifications:** Nodemailer (Gmail SMTP) + Telegram Bot (optional)
- **Hosting:** Vercel

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run, in order:
   - `supabase/schema.sql` — core tables (orders, products, categories, quiz registrations, admin settings)
   - `supabase/migrations/2026-04-28-polish.sql` — testimonials, about, trust bar, social posts, product tags, quiz mappings (idempotent — safe to re-run)
3. Create Storage buckets (both public):
   - `screenshots` — payment proof uploads
   - `product-images` — product images, testimonial avatars, Krupali portrait, and social-strip thumbnails (sub-foldered: `products/`, `testimonials/`, `about/`, `social/`)
4. Create admin user(s) in **Authentication › Users** (email + password).
5. Copy your project URL, anon key, and service role key.

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
- `NEXT_PUBLIC_UPI_ID` — UPI ID for payments
- `NEXT_PUBLIC_UPI_PAYEE` — display name for UPI

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database Schema

### Core (`supabase/schema.sql`)

| Table | Purpose |
|---|---|
| `orders` | Customer orders with items, total, payment screenshot, status |
| `admin_settings` | Notification email/phone, UPI ID, Telegram config (singleton) |
| `quiz_registrations` | Users who registered via the crystal quiz |
| `categories` | Product categories (Crystals, Bracelets, etc.) |
| `products` | Full product catalog with images, pricing, descriptions, specs |

### Polish-sprint additions (`supabase/migrations/2026-04-28-polish.sql`)

| Table / Column | Purpose |
|---|---|
| `testimonials` | Customer testimonials surfaced on the home page (admin CRUD, with `[PLACEHOLDER]` seeds) |
| `about_settings` | Singleton row for the "Meet Krupali" strip — bio, portrait, Instagram + WhatsApp links |
| `trust_bar_items` | Three editable hero trust tiles (icon + title + subtitle) |
| `social_posts` | Admin-managed Instagram / WhatsApp post grid (image + link + optional caption) |
| `products.tags` | `TEXT[]` (GIN-indexed) powering the shop intent-chip filter |
| `quiz_result_products` | Many-to-many mapping of quiz outcomes (A/B/C/D) → curated products |

All tables have Row Level Security (RLS) enabled. The service role has full access; the public role can read active rows (`is_featured`, `is_active`, `is_active`-style flags) and the about/quiz-mapping rows directly.

## Routes

### User-facing
| Route | Description |
|---|---|
| `/` | Home — hero with trust bar, featured carousel, offerings, **Meet Krupali**, **testimonials**, key attractions, **social strip**, closing quote |
| `/shop` | Product grid with **intent-chip filter**, **sort dropdown**, deep-link **category anchors**, and **`?match=A/B/C/D`** quiz-result mode |
| `/product/[slug]` | Product detail with image gallery, specifications, Add to Cart, **"You may also love" rail** |
| `/services` | Astrology & wellness services — Kundali sitting tiers (₹5,000 / ₹11,000) |
| `/contact` | Contact form + social links |
| `/cart` | Full cart view with quantity controls |
| `/checkout` | Order form, dynamic UPI QR code, screenshot upload **with confirmation animation**, transparency strip, sticky order summary |
| `/checkout/success` | Order placed confirmation **with "What happens next" 3-step strip** |
| `/terms` | Terms & Conditions / Privacy Policy |

### Admin Dashboard
| Route | Description |
|---|---|
| `/admin/login` | Admin login (Supabase email/password) |
| `/admin` | Orders dashboard — filter, view, approve/reject |
| `/admin/products` | Product list — search, visibility toggle, edit/delete |
| `/admin/products/new` | Create new product (image upload + **intent-tag chips** + quiz match keys) |
| `/admin/products/[id]/edit` | Edit existing product |
| `/admin/categories` | Category management — inline add/rename/delete |
| `/admin/quiz-mappings` | Pick the products that surface for each quiz outcome (A/B/C/D) |
| `/admin/testimonials` | Add/edit/delete testimonials, mark featured, upload avatars |
| `/admin/about` | "Meet Krupali" strip — bio, portrait, Instagram URL, WhatsApp link & number |
| `/admin/trust-bar` | Edit the three hero trust tiles (icon name + title + subtitle) |
| `/admin/social-posts` | Curate the home-page social grid (image upload + link + caption) |
| `/admin/settings` | Notification email, phone, UPI ID, Telegram config |

### API
| Route | Method | Description |
|---|---|---|
| `/api/products` | GET | Public product list with `tags`, optional `?category=slug` and `?slug=` |
| `/api/orders` | POST | Create order + upload payment screenshot |
| `/api/quiz-register` | POST | Submit quiz registration (name, DOB, email, phone) |
| `/api/testimonials` | GET | Public featured testimonials |
| `/api/about` | GET | Public Krupali bio + social URLs |
| `/api/trust-bar` | GET | Public active trust-bar items |
| `/api/social-posts` | GET | Public active social posts |
| `/api/quiz-mappings/[key]` | GET | Curated products for quiz outcome `A`/`B`/`C`/`D` |
| *(admin auth)* | — | Handled directly via Supabase Auth (`signInWithPassword`) in the browser with session persistence and auto-refresh |
| `/api/admin/orders` | GET | List orders (paginated, filterable by status) |
| `/api/admin/orders/[id]` | GET/PATCH | Get or update order status |
| `/api/admin/products` | GET/POST | List or create products (image upload + tags) |
| `/api/admin/products/[id]` | GET/PATCH/DELETE | Get, update, or delete a product |
| `/api/admin/categories` | GET/POST | List or create categories |
| `/api/admin/categories/[id]` | PATCH/DELETE | Update or delete a category |
| `/api/admin/testimonials` | GET/POST | List or create testimonials |
| `/api/admin/testimonials/[id]` | PATCH/DELETE | Update or delete a testimonial |
| `/api/admin/about` | GET/PATCH | Read or update the singleton about row |
| `/api/admin/trust-bar` | GET/PUT | Read or replace-all trust-bar items |
| `/api/admin/social-posts` | GET/POST | List or create social posts |
| `/api/admin/social-posts/[id]` | PATCH/DELETE | Update or delete a social post |
| `/api/admin/quiz-mappings` | GET/PUT | Read all mappings or replace one result key's product list |
| `/api/admin/settings` | GET/PUT | Read or update admin settings |

## Features

- **Editorial home page:** trust bar, Meet Krupali strip, auto-rotating testimonials carousel, dynamic category attractions, social-strip, all admin-editable.
- **Conversion-plumbed shop:** intent-chip multi-select filter, sort dropdown, category anchors with deep-links (`/shop#crystals`), and a quiz-result mode (`/shop?match=A`) that surfaces only admin-curated products.
- **Hover-swap product cards** that flip to the secondary image on hover when one is set.
- **"You may also love" rail** on every product detail page (3 random same-category picks).
- **Crystal Quiz USP:** 7-question quiz with registration gate (Name, DOB, Mobile, Email) and marketing opt-in. Result CTA links straight to the curated **`?match=`** shop view — no dead ends, even if the result key has zero mappings (the shop renders a friendly empty-state nudge).
- **Cart:** localStorage-backed, persists across sessions, real-time totals with bounce animation and toast notifications.
- **Checkout transparency:** dynamic UPI QR code, upload confirmation animation, "verified within 12 hours" trust strip, sticky order summary on desktop.
- **Checkout success:** "What happens next" 3-step strip (verify → cleanse & pack → tracking emailed).
- **Admin Dashboard:** Order management with approve/reject + full editorial CRUD over products, categories, testimonials, about, trust bar, social posts, quiz mappings, settings.
- **Notifications:** Email (Gmail SMTP) on new orders + optional Telegram push.
- **Performance polish:** hero `placeholder="blur"` for instant LCP painting, `sizes` on all `<Image>` components, faster (300ms) tile-hover transitions, GIN index on `products.tags`.
- **Responsive:** Mobile-first design with glass-effect header, carousels, animations, reduced-motion support.

## Order Flow

1. User browses `/shop` → adds items to cart (with visual feedback).
2. Goes to `/checkout` → fills customer details → pays via UPI link/QR.
3. Uploads payment screenshot → green "Screenshot received" confirmation → places order.
4. Admin gets email + Telegram notification.
5. Admin reviews at `/admin` → approves or rejects.
6. User sees the "What happens next" 3-step strip on `/checkout/success`.

## Quiz → Shop Bridge

1. User answers the 7-question quiz → registers (first-time only).
2. Result modal shows the matched stone (Rose Quartz / Amethyst / Citrine / Black Tourmaline) and a **Shop your match** CTA.
3. CTA navigates to `/shop?match=A` (or B/C/D), which calls `/api/quiz-mappings/[key]` and renders only the products an admin has mapped under `/admin/quiz-mappings`.
4. If no mapping exists yet, the shop shows a friendly empty-state with a "See all pieces" button — never a dead end.

## Admin Workflows

### First-time setup checklist (post-deploy)
1. Run `supabase/schema.sql` then `supabase/migrations/2026-04-28-polish.sql` in Supabase SQL Editor.
2. Visit `/admin/login`, sign in with the user you created in Supabase Auth.
3. **Categories** → add your collections (e.g. Crystals, Bracelets, Pyramids).
4. **Products** → add products with image, price, description, intent tags, and (optionally) quiz match keys.
5. **Quiz Mappings** → pick 3–6 products per result (A/B/C/D) so the quiz CTA lands somewhere meaningful.
6. **Testimonials** → delete the 3 `[PLACEHOLDER]` rows seeded by the migration and add real ones as they come in.
7. **About / Krupali** → upload her portrait, polish the bio, paste Instagram/WhatsApp links (the migration pre-fills them, edit if needed).
8. **Trust Bar** → tweak the 3 seeded tiles if you want different copy.
9. **Social Strip** → add 4–6 Instagram/WhatsApp post screenshots with their permalink URLs.
10. **Settings** → notification email, phone, UPI ID, Telegram config.

### Product flow
1. Categories at `/admin/categories`.
2. Products at `/admin/products/new` — title, price, description, two images, category, optional specifications, intent tags, quiz match keys.
3. Products appear on the public shop page and home carousel automatically.
4. Toggle visibility with the eye icon, edit/delete as needed.

## Telegram Setup (Optional)

1. Message [@BotFather](https://t.me/BotFather) on Telegram → `/newbot`.
2. Copy the bot token.
3. Start a chat with your bot, then visit `https://api.telegram.org/bot<TOKEN>/getUpdates` to find your chat ID.
4. Add both to admin settings or `.env.local`.

## Deployment

The app is deployed on Vercel with GitHub integration. Every push to `main` triggers a new deployment.

```bash
# Or deploy manually
npx vercel
```

Set environment variables in the Vercel dashboard under **Project Settings → Environment Variables**.

> **Reminder when redeploying after schema changes:** run any new SQL from `supabase/migrations/` against your Supabase project before the first request hits the new code, otherwise the new admin pages and home strips will surface 500s. All migrations are idempotent.
