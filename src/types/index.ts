export interface Product {
  slug: string;
  title: string;
  subtitle: string;
  price: string; // e.g. "$24.99" - display string
  priceNum: number; // numeric for calculations (e.g. 24.99)
  blurb: string;
  img: string;
  desc: string;
}

export interface Offering {
  title: string;
  blurb: string;
  href: string;
  img: string;
}

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
  price: string;
  priceNum: number;
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

export interface AdminSettings {
  id: number;
  notification_email: string;
  notification_phone: string;
  upi_id: string;
  telegram_bot_token: string | null;
  telegram_chat_id: string | null;
  updated_at: string;
}
