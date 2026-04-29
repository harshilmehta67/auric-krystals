export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  price: number;
  blurb: string;
  description: string;
  image_url: string;
  image_url_2: string | null;
  specifications: string | null;
  category_id: string | null;
  category_name?: string;
  tags: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string | null;
  quote: string;
  rating: number | null;
  avatar_url: string | null;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface AboutSettings {
  id: number;
  bio_short: string;
  bio_long: string;
  photo_url: string | null;
  instagram_url: string | null;
  whatsapp_link: string | null;
  whatsapp_number: string | null;
  updated_at: string;
}

export interface TrustBarItem {
  id: string;
  icon_name: string;
  title: string;
  subtitle: string;
  sort_order: number;
  is_active: boolean;
  updated_at: string;
}

export interface SocialPost {
  id: string;
  image_url: string;
  link_url: string;
  caption: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuizMapping {
  result_key: "A" | "B" | "C" | "D";
  products: Product[];
}

export interface ServicesPillar {
  key: string;
  icon: string;
  title: string;
  body: string;
}

export interface ServicesTier {
  key: string;
  eyebrow: string;
  title: string;
  price_label: string;
  // Optional USD price label shown to visitors outside India (geo-detected
  // via x-vercel-ip-country header). Falls back to price_label if empty.
  price_label_usd?: string;
  price_unit: string;
  duration: string;
  blurb: string;
  features: string[];
  badge_label?: string;
  cta_label: string;
  cta_query: string;
}

export interface ServicesStep {
  step: string;
  title: string;
  body: string;
}

export interface ServicesSettings {
  id: number;
  hero_image_url: string;
  hero_eyebrow: string;
  hero_title: string;
  hero_title_2: string;
  hero_blurb: string;
  pillars_eyebrow: string;
  pillars_title: string;
  pillars: ServicesPillar[];
  sittings_eyebrow: string;
  sittings_title: string;
  sittings_blurb: string;
  tiers: ServicesTier[];
  sittings_footer: string;
  steps_eyebrow: string;
  steps_title: string;
  steps: ServicesStep[];
  cta_title: string;
  cta_blurb: string;
  cta_label: string;
  updated_at: string;
}

export const INTENT_TAGS = [
  "love",
  "abundance",
  "protection",
  "calm",
  "clarity",
  "healing",
  "grounding",
  "prosperity",
] as const;
export type IntentTag = (typeof INTENT_TAGS)[number];

export const QUIZ_RESULT_KEYS = ["A", "B", "C", "D"] as const;
export type QuizResultKey = (typeof QUIZ_RESULT_KEYS)[number];

export const QUIZ_RESULT_LABELS: Record<QuizResultKey, string> = {
  A: "Rose Quartz — The Heart Healer",
  B: "Amethyst — The Spiritual Guardian",
  C: "Citrine — The Abundance Attractor",
  D: "Black Tourmaline — The Protective Guardian",
};

export interface SocialLink {
  id: string;
  label: string;
  shortLabel: string;
  url: string;
  icon: string;
}

export interface CartItem {
  slug: string;
  title: string;
  price: number;
  img: string;
  quantity: number;
}

export interface OrderFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  orderNotes: string;
}

export interface Order {
  id: string;
  order_number: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  order_notes: string | null;
  items: CartItem[];
  total: number;
  screenshot_url: string | null;
  status: "pending" | "processed" | "failed";
  created_at: string;
  updated_at: string;
}

export interface QuizRegistration {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  marketing_optin: boolean;
  quiz_result: string | null;
  created_at: string;
}

export interface AdminSettings {
  id: number;
  notification_email: string;
  notification_phone: string;
  upi_id: string;
  telegram_bot_token: string | null;
  telegram_chat_id: string | null;
  updated_at: string;
}
